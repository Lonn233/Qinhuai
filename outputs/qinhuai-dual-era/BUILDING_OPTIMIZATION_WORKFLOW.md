# 后续建筑可复用优化流程（单栋准入，不是批处理）

## 2026-10-20 当前状态

- 已完成网页主场景低风险性能优化、真实 Chrome 采样和生命周期回归；详见项目根目录 `PERFORMANCE_AUDIT_20261020.md`。
- 当前主场景实测约 1,196 draw calls、6,748,603 提交三角形、1,151 geometries、203 textures；这些是当前瓶颈基线，不是建议继续堆叠高模的余量。
- 魁星阁 Blender 导入在本轮因 NumPy 内存分配失败，没有生成新的可批准 LOD。不得把历史候选或失败输出当成本轮新结果。
- 后续 Blender 运行必须关闭浏览器/其他大内存程序，使用独立 `--output-dir` 和 `--python-exit-code 1`；失败要保留明确日志并停止，不覆盖源文件。

## 0. 准入原则

本轮只有魁星阁获准试验，其他建筑不减面、不重排。先测量再提出预算；候选批准前不得替换默认高模。独立单页减少其他变量，避免把换光、降分辨率、取消反射误记为模型优化收益。

每栋保留：source/ 原始 GLB 与 .blend、optimized/ 可编辑候选、export/ 固定输出、textures/ 可选贴图、renders/ 固定视角对照、reports/ 计数/参数/校验/实测、manifest.json 审批。

## 1. 接收并审计

- 记录文件 SHA256、字节数、工具版本、单位、坐标轴、pivot、原始 world transform、canonical bounds。
- 统计实际三角形（不是 Blender 多边形显示值）、顶点、unique primitive、材质、骨骼/动画、重复材质和几何、UV、法线、透明度、图片尺寸与字节。
- 区分唯一资产资源与实例数。实例共享几何节省内存，但每个可见实例仍有顶点/三角形工作；平面反射与阴影也会重复提交。
- 单体一个巨型 primitive 时，优先减轻几何与贴图；多材质碎片很多时再考虑材质归并/图集，不能盲目合成整座城。
- 不把压缩文件体积当作 GPU 内存。分别记录磁盘、解码 geometry buffers、纹理理论占用、实际浏览器资源对象计数和可测的内存。

## 2. 可回退模型试验

- 原高模永不覆盖，按原始源分别产生各 LOD。
- 拆解/人工标记屋檐、脊兽、栏杆、窗口和第一人称可见细部，确认薄面双面策略；AI 生成单网格的“内部面”不能靠猜测删除。
- 默认禁止拓扑激进简化。保留 UV seam/normal，保护轮廓；相同三角数下优先保关键轮廓，不追求机械固定百分比。
- 文档建议 LOD0 5–20 万、LOD1 1–5 万、LOD2 1千–8千仅是预算候选。当前魁星阁试验并未全部达到，不复制其 90 万近景预算给几十栋。
- 若自动减面达不到预算或近景变差，转人工局部重拓扑+高低模 normal/AO 烘焙。已有 normal 贴图不等于已完成新拓扑烘焙。
- Blender 中保留未应用修改器时必须真实保留堆栈；外部简化后的 .blend 应清楚标注为简化网格。两种交付不能混称。

本轮可复现命令（只支持已审计的魁星阁，不是通用批处理脚本）：

```powershell
$Project = 'E:/soft/project/codex-Qinhuai/outputs/qinhuai-dual-era'
$Python = 'C:/Users/Lonn/anaconda3/python.exe'
Set-Location $Project
npm ci --prefix tools/asset-deps
& 'E:/blender/blender.exe' --background --factory-startup --python "$Project/tools/blender_kuixing_pilot.py" -- --root $Project --mode audit --skip-render
node tools/kuixing-simplify.cjs LOD0
node tools/kuixing-simplify.cjs LOD1
node tools/kuixing-simplify.cjs LOD2
& 'E:/blender/blender.exe' --background --factory-startup --python "$Project/tools/blender_finalize.py" -- --root $Project --level LOD0
# LOD1 / LOD2 使用同一命令分别导出；不要并行打开三份原始高模。
& $Python tools/texture_variants.py
& $Python tools/audit-assets.py
```

Python 使用 NumPy / Pillow；独立预览额外依赖 ModernGL 5.12.0 / glcontext 3.0.0（位于 tools/pydeps）。未确认新机器图形驱动前，不把 native 预览当作通用无条件可用工具。

Blender 原模渲染内存占用很高，默认不渲染。仅明确指定 `--render` 才开启；`--mode lod` 是**本轮未执行的 Blender Decimate 实验路径**，输出隔离至 assets/kuixing-pilot/blender-decimate-experiment，不能覆盖 canonical 候选报告后假装为同一算法。对其他楼必须先适配其结构和保护区域。

## 3. 贴图

- 先保持原贴图仅比较几何；再单独测试 2K/1K/512，而不是同时变更所有因素。
- Base color 按 sRGB 解释、线性域滤波；roughness/metallic/AO 用线性数据；normal 必须向量归一化。
- 按屏幕像素/关键近景分配 texel density。窗口、匾额等不能因“统一 1K”不可辨认。
- 若引入 KTX2，验证 KTX2Loader/transcoder、目标显卡和移动端格式、离线打包；若引入 Meshopt/Draco，记录解码成本和加载器依赖。压缩不代替减面。
- 共享材质/纹理与实例，确保最后一个使用者释放时才 dispose。不要在切换时代时销毁另一个时代仍共享的资源。

## 4. 运行时 LOD / 资产生命周期

独立工具 `building-asset-registry.js` 当前只是测试过的静态建筑基础组件，未代替整个项目资产管理器。拒绝未批准候选（审计需显式 allowCandidate），承诺同一楼型/等级的并发加载去重、几何/材质共享、引用计数和显式释放；不支持骨骼建筑的简单 clone。

`createBuildingLOD()` 的试验阈值为投影高度 350 / 120 CSS px、迟滞 12%。必须根据目标分辨率和真实模型调整，**不是已批准生产阈值**。父级默认竖直缩放，保持原 canonical bounds。只在主相机更新一次，反射相机不能重新选级。只对所见等级拾取；关闭层仍不等于释放资源。

此原型会持有传入所有等级，**不实现按需分区下载、预加载调度、显存预算/淘汰或异步 LOD 换入**。引入几十栋前，必须另行验证这些能力，不应一次全部 acquire 所有高模。销毁 registry 前先移除场景中仍引用租约的 clone。

## 5. 固定对照与验收

1. Khronos Validator 0 errors，warning 逐项解释；索引、有限位置/法线、UV、材质/图片存在，源文件 SHA 不变。
2. 正、侧、顶、斜俯视相同相机与灯光，对比檐角、脊饰、窗棂、薄片/孔洞；计算 silhouette IoU 只是辅助，不可自动批准。
3. 游戏内同视角检查四天气、夜景照明、河面建筑/灯笼倒影、第一人称近景、线框、图层、导出、现代/明初切换。不得改变碰撞/高度/pivot/位置补偿视觉差异。
4. 相同硬件/分辨率，基线与候选各至少三轮五场景手动采样；单独做冷启动/暖启动复测、长任务与内存分析。非前台/操作干扰/资源加载失败/反射回退的样本作废。
5. 记录比较器输出与游戏截图，由用户确认视觉，再将 manifest.approved 改为 true；仅批准后的指定资产进入默认构建。审批不自动扩散到其他建筑。
6. 对复杂度差异大的建筑重新预算；以“最坏可见区域 + 反射 + 阴影 + 后处理”定总预算，而不是只算地图文件总面数。

## 6. 已使用工具与参考

- Three.js 0.180.0 本地 WebGLRenderer / LOD / Raycaster / GLTFLoader / Water 源码与 THREE-LICENSE.txt（MIT）。尤其核查 info.autoReset、LOD 的距离选择与 raycast 行为。
- meshoptimizer 1.3.0 的 simplifyWithAttributes / lock / compactMesh 官方实现与随包许可（MIT），版本与依赖锁在 tools/asset-deps。
- Khronos glTF Validator 2.0.0-dev.3.10（Apache-2.0），九份原始验证报告保留。
- Blender 5.2.1 LTS，导入/导出日志保留；本轮实际简化算法不是 Blender 修改器。
- ModernGL 5.12.0、glcontext 3.0.0：离线本地 GL 预览；其渲染统计不能作为网页 FPS。
- 原模型/贴图版权按用户资产自身授权，本轮未推断其可商用范围。

参考地址（资料指向，不代表本轮浏览器性能已测试）：

```text
https://threejs.org/docs/#api/en/renderers/WebGLRenderer
https://threejs.org/docs/#api/en/objects/LOD
https://github.com/zeux/meshoptimizer/tree/v1.3/js
https://github.com/KhronosGroup/glTF-Validator
https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/decimate.html
```
