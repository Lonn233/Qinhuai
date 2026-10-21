# 本轮性能审计与魁星阁优化样板

日期：2026-10-17。状态：**离线审计、低风险代码修改和候选资产已交付；浏览器真实性能对比与游戏内视觉验收未完成。**

## 1. 结论与范围

- 保留 Three.js 0.180.0 / WebGLRenderer。没有迁移引擎，没有批量减面，没有重建地图。
- 默认 `index.html` 仍使用原始魁星阁，桥、两种荷花 GLB 及地形/河岸/道路/绿化/建筑布置不变。
- 仅实施共享重复夜景材质/贴图、导出临时材质释放；新增审计工具与独立候选测试入口。没有减少阴影精度、水面反射、灯光数量或 Bloom 画质。
- 原始魁星阁不是“几十万面”：实际为 **6,752,372 个三角形，205,823,700 字节**，一个 Mesh / 一个 primitive / 一个材质。其问题主要是几何量，而非本体 draw call 数。
- 原模几何缓冲约 197.03 MB。若未来 40 栋均采用同等原始资产，仅唯一几何数据就约 7.88 GB，且尚未计贴图、反射、阴影、JS、驱动及双缓存。此为容量推算，不是当前显存实测。
- 当前 LOD0/1/2 是保守实验档，**均未批准进入默认场景**。不能把本轮样板当成几十栋建筑的最终预算。

## 2. 数据可信度与阻塞

浏览器工具对 `http://127.0.0.1:4173` 的访问被已保存权限拒绝。本轮没有改用其他浏览器、CDP、其他端口或间接脚本绕过；也未自动操作测量面板。

| 指标 | 优化前 | 工程优化后 / 候选后 | 状态 |
|---|---|---|---|
| 平均 FPS / 1% Low / 最低 FPS | 未测 | 未测 | 需要实际浏览器运行 |
| CPU 动画回调 / CPU render 提交时间 | 未测 | 未测 | 不是 GPU 时间 |
| GPU 时间 | 未测 | 未测 | 设备支持 timer query 才能取得 |
| 每帧 Draw Calls / Triangles | 未测 | 未测 | 包括反射、阴影及后处理提交 |
| 实际渲染 geometry / texture 数量 | 未测 | 未测 | 不等于显存字节数 |
| 首次 render 提交 / 核心模型就绪时间 | 未测 | 未测 | 不等同于用户已看到完整画面 |
| 场景切换耗时与内存变化 | 未测 | 未测 | 需固定相机、设备、分辨率 |
| GLB 文件、三角形和缓冲区字节 | 已测 | 已测 | 见资产清单及报告 |
| 离线五视角模型图像差异 | 已测 | 已测 | 非游戏截图、非帧率测试 |

设备清单记录 Ryzen 7 6800H、约 32 GiB 内存、RTX 3060 Laptop 6144 MiB 显存以及集显。**不能假定浏览器正在使用独显**，手动报告必须记录实际 WebGL renderer。

`browser-measurements.json` 明确保留 baseline/optimized 为 null。未填写估算 FPS，未承诺 60 FPS。

## 3. 全工程审计发现

| 模块 | 已核实实现 / 风险 | 本轮处理 |
|---|---|---|
| Renderer | ACES、sRGB、DPR 上限 1.6、抗锯齿；preserveDrawingBuffer 支撑截图 | 全部保留，不擅自关闭截图功能 |
| 场景组织 | 程序化静态面已有合并，重复结构已有实例化；临时 batches/custom 已清理 | 不重复重构、不合并成无法细分剔除的整城 Mesh |
| 双时期 | 建筑可见性切换；魁星阁两实例共享原始几何/材质，但原来分别生成夜景派生贴图 | WeakMap 共享派生结果；两套灯具位置完全不变 |
| 加载 | GLB 以惰性数据块内嵌，顺序解码/解析，有加载错误提示 | 保留；单 HTML 仍很大，不能宣称已做网络分区加载 |
| 动画 | 水/云/荷花持续更新，因此通常是连续渲染 | 不人为冻结动态效果来提高 FPS |
| 水体 | 已使用官方 Water；平面反射仅第一人称透视启用，俯视没有该通道 | 不添加第二套反射；测试必须含第一人称河面 |
| 阴影 | 4096²、autoUpdate=false，必要时标脏；灯具大多无额外阴影 | 保留参数；暂不以降低分辨率换帧率 |
| 后处理 | 夜景、非线框才启用 Composer，已有单一 OutputPass | 不重复加输出转换、不关闭 Bloom |
| 天空环境 | PMREM 已按天气缓存 | 不把已有缓存记成本轮新增收益 |
| 统计 | renderer.info.autoReset=false，renderScene 开始 reset | 按整帧累计；反射/阴影可重复提交同一几何 |
| 导出 | 临时克隆材质缺少 finally 清理，失败也可能留下临时资源 | 增加 finally.dispose；保留原材质和贴图 |
| 生命周期 | 隐藏不等于释放；无成熟分区流式加载。Water 的内部 render target 释放仍需后续专项审查 | 仅提供独立引用计数工具，不全面改造现有生命周期 |
| 可扩展性 | 双时期保留、巨型单楼模型、整包加载是后续几十栋的主要风险 | 样板验收前，不开启全场景动态 LOD 或资产流式迁移 |

已有 `model-assets.js` / `runtime-assets.cjs` 并未被当前入口导入；它们不是本轮已部署的优化。

## 4. 已实施的低风险改动

1. `pavilion-lighting.js`：相同源材质对应一个共享夜景派生材质，避免跨时期重复制作两张 2048² CanvasTexture。按 RGBA8+完整 mip 链计算，最多避免约 **42.67 MiB 纹理分配**，另少两份约 **32 MiB canvas backing**；这是资源算术估计，不是实测显存/堆/FPS。canvas 内存并不等同于 JS heap。
2. `model-source.js`：导出过程临时材质在成功/失败后均释放；原对象材质不释放。
3. `performance-audit.js`：仅 `?perf=1` 开启面板，必须手动点击开始；正常入口不运行采样。
4. 候选构建使用原模 canonical bounds 对齐高度与位置，避免减面后的包围盒改变让楼体漂移。默认路径仍使用原文件。
5. 独立 `building-asset-registry.js`：准入门槛、加载去重、租约/释放、按投影像素选 LOD 与迟滞、只对主相机选级、只拾取当前 LOD。**未接入默认渲染循环。**

## 5. 对照入口与手动采样

工程路径：`E:/soft/project/codex-Qinhuai/outputs/qinhuai-dual-era`。

| 页面 | 内容 |
|---|---|
| `audit-baseline.html?perf=1` | 冻结旧源码 + 相同审计探针；原模 |
| `index.html?perf=1` | 低风险工程优化后；原模 |
| `pilot-LOD0.html?perf=1` | 工程优化后，仅魁星阁替换 LOD0 |
| `pilot-LOD1.html?perf=1` | 工程优化后，仅魁星阁替换 LOD1 |
| `pilot-LOD2.html?perf=1` | 工程优化后，仅魁星阁替换 LOD2 |

所有页面由现有构建流程生成，资产内嵌，无新增 CDN/运行时纹理请求。离线载荷、脚本语法及哈希已检查；**页面未在真实浏览器中验收**。不要同时打开五个重型页面，以免互相占用内存。

使用当前本地服务打开相应文件，保持同一浏览器版本/显示分辨率/缩放/DPR/显卡、电源与散热条件；一次仅运行一个页面，关闭不相关 GPU 负载。重置图层后：

1. 等全部资产加载完成，点击“开始五场景测试”。每场景预热 3 秒、采样 10 秒。
2. 顺序为全景、桥旁建筑密集区、**第一人称河面反射**、魁星阁夜景近景、夜景现代/明初切换。
3. 测试时不缩放、拖动、改天气、切换标签页；后台/键盘/鼠标操作会使结果无效。
4. 每页至少三轮，下载 JSON。测试会恢复进入测试前的相机、时期、天气和线框。
5. 先对比 baseline 与 index，区分工程优化收益；再对比 index 与各候选，区分资产减面收益。不能把两者混成一次结果。
6. 首屏/加载时间需另外做至少三次冷启动及三次缓存命中的独立页面加载，并用浏览器 Performance/Memory 记录主线程长任务和 GPU 进程情况。重复点击采样不等于重复冷启动。
7. 白天/夜间、四天气、线框、各图层、第一人称近距离、导出、桥梁/灯笼倒影、时期切换，各候选都需要实际肉眼核验；当前五场景采样不代替全部视觉 QA。

```powershell
$Project = 'E:/soft/project/codex-Qinhuai/outputs/qinhuai-dual-era'
node "$Project/tools/compare-performance.cjs" '完整路径/baseline.json' '完整路径/optimized.json' '完整路径/comparison.json'
```

比较器只读取实际下载的报告，要求至少三轮有效样本、同设备/浏览器/投影矩阵/天气/分辨率/渲染设置；缺失 GPU 数据保留 null。结果取每轮摘要的中位数，正的百分比仅代表“更高”，不总是“更好”。

## 6. 验证证据

- `baseline-snapshot.json`：冻结原始文件哈希；冻结目录未改动。
- `asset-inventory.json`：实际文件、三角形、geometry buffer、图片尺寸/哈希。
- `build-results.json`：五个页面的准确字节数、SHA256、构建耗时；browserVerified=false。
- `tests.log`：21/21 Node 测试通过，包括加载失败、导出失败、夜景共享、地形/程序生成几何和变换一致、时期/天气/第一人称行为、LOD/缓存/统计。
- `test-frozen-baseline.log` 及 `test-*.html.log`：原始离线页及所有新对照页的嵌入载荷与对应 GLB SHA256 一致。没有更改其他 GLB。
- 真实模型未参与 mocked WebGL 测试；真实 GLB 由 Khronos glTF Validator 单独校验。九个文件均 **0 errors**，保留原有 tangent-space warning；格式通过不等于游戏内视觉通过。
- Blender 原模渲染曾因内存/上下文资源不足失败，日志保留，未将失败结果标为成功。离线对照采用独立 native OpenGL，仅用于资产外形比较。

## 7. 构建、回滚与后续门槛

```powershell
$Project = 'E:/soft/project/codex-Qinhuai/outputs/qinhuai-dual-era'
$env:QINHUAI_DEPS = 'C:/Users/Lonn/Documents/Codex/2026-10-15/new-chat/work/kuixing-build'
Set-Location $Project
npm test
node tools/build-pilot-pages.cjs
```

新机器可在工程目录按 package.json 安装 Three.js 0.180.0 / esbuild 0.25.10，清除 QINHUAI_DEPS 后使用工程自身 node_modules。资产工具另有 `tools/asset-deps/package-lock.json`。

原始可直接使用的单页位于 `E:/soft/project/codex-Qinhuai/work/perf-baseline-20261017/index.html`。如需完整回滚，先保存当前修改，再将冻结清单中的源码及 index.html 恢复至工程目录；不要覆盖原始 GLB。候选文件不被默认入口引用，删除候选无需修改正式模型。不要覆盖/修改冻结快照本身。

**验收门槛：** 用户批准候选近景/夜景/倒影视觉，浏览器三轮实测优于或不劣于基线且无加载错误，位置/图层/导出/时期切换通过后，才讨论替换默认资产。当前尚未满足，禁止批量处理其他建筑。
