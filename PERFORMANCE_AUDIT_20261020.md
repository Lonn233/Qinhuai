# 《上元秦淮》性能审计与优化报告

日期：2026 年 10 月 20 日  
项目：`qinhuai-dual-era`  目标页：主地图导入预览

## 结论摘要

本轮完成了主场景的低风险网页优化、可复核的性能采样工具、建筑资产审计工具和单栋建筑 Blender 试验流程。没有批量删除场景内容，没有覆盖原始 GLB，没有修改 `.local-data`，没有替换未经人工确认的建筑候选模型。

当前最明确的瓶颈是**真实场景每帧提交的渲染工作量**：在 RTX 3060 Laptop、Chrome 155、1920×1080、DPR 1、夜景 gate 视角下，稳定采样为约 1,196 次 draw call、6,748,603 个提交三角形、1,151 个 geometry、203 个 texture。主场景已经能运行在 60 FPS 以上，但这组提交量会在低端设备、复杂近景、倒影/阴影同时可见时产生明显压力。

这轮网页改动的目标是减少无效工作并保持画面功能，不是用降低画质掩盖模型问题。相同机器的前后采样显示平均 FPS 小幅提升，结果存在正常运行时波动，因此不把它描述为模型级大幅加速。

## 已证实的问题

### 1. 可见帧的提交量偏高

真实 Chrome 硬件 GPU 采样：

| 指标 | 基线三轮合计/统计 | 优化后三轮合计/统计 |
| --- | ---: | ---: |
| 有效帧数 | 2,378 | 2,457 |
| 平均 FPS | 98.96 | 102.43 |
| 1% Low FPS | 54.10 | 54.79 |
| 最低 FPS | 41.67 | 54.35 |
| CPU render submission 均值 | 9.441 ms | 9.422 ms |
| Draw calls 均值 | 1,196 | 1,196 |
| 提交三角形均值 | 6,748,603 | 6,748,603 |

这组数据来自同一 Chrome/设备/分辨率/夜景 gate 视角的三轮对照，原始文件保存在 `work/performance-20261020/baseline.json` 和 `work/performance-20261020/optimized.json`。FPS 约提升 3.51%，CPU 提交时间约下降 0.20%；draw call 和三角形没有下降，说明本轮收益主要来自逐帧调度与无效更新减少，而不是几何复杂度降低。最低帧的改善不能单独归因于代码改动，应结合运行时波动理解。

另有独立的 GPU timer query 采样，3 轮分别为 116.14、99.46、101.15 FPS；GPU 均值分别为 8.14、9.51、9.41 ms。它与前述外部对照使用的 CPU 统计口径不同，不能混合计算提升比例。完整文件为 `work/performance-20261020/instrumented.json`。

### 2. 资源规模已经超过只靠网页参数调节的舒适范围

离线 GLB 元数据审计共发现 99 个资产条目。较大的资源包括：魁星阁原始 GLB 205.8 MB / 6,752,372 三角形，主地图 tile-09 128.5 MB / 1,924,825 三角形，tile-10 60.7 MB / 870,438 三角形，荷花灯 41.0 MB / 1,169,780 三角形，tile-05 20.6 MB / 275,894 三角形。该审计只统计 GLB 元数据，不把文件体积冒充显存，也不代表每一帧都可见。

运行时统计则确认：导入主场景所需 tile、灯组、树木和学生角色均已加载，人物材质带纹理并接收环境外溢光；完整浏览器回归没有发现请求失败或页面错误。

## 本轮已实施的优化

### 网页运行时

- 在 `qinhuai-modern-import.js` 中让隐藏标签页停止场景更新和渲染，并清空运动状态，避免后台标签持续消耗 CPU/GPU。
- 仅在 orbit 模式更新 OrbitControls，避免第一人称/第三人称控制模式下重复执行无效轨道计算。
- 统一灯组动画使用同一 RAF 时间戳，避免每组灯光重复读取时间源。
- 在每帧采样前正确重置 renderer 统计，保留真实 draw call/triangle 读数。
- 保留人物环境光接收回调：`onReady: avatar => nightLighting.environmentSpill.attachReceivers(avatar, { external: true })`。
- 仅在 URL 带 `?perf=1` 时加载性能采样面板；普通用户不会自动运行基准测试，也不会写入持久化设置。

### 性能采样与诊断

- 新增 `import-performance-audit.js`：采样当前视角的帧间隔、CPU render submission、GPU timer query、renderer.info、JS heap（浏览器支持时）以及场景设置快照。
- 采样会检测相机、视口、昼夜、灯光、后处理和 tile 设置变化；采样中发生鼠标、滚轮、键盘、输入或窗口尺寸变化时，该轮作废。
- GPU query 使用非阻塞轮询并限制未完成 query 数量；GPU disjoint、上下文丢失和页面隐藏会使样本失效。
- 采样器销毁时移除监听器、删除 query、移除面板；不会把诊断数据保存到应用设置。

### 资产审计与 Blender 流程

- 新增 `tools/audit-glb-assets.cjs`，对 GLB 做 SHA-256、文件大小、mesh/node/primitive、实例三角形、材质、纹理和动画元数据统计；不改写原始资产。
- `tools/blender_kuixing_pilot.py` 现在要求独立输出目录，限制为魁星阁单栋试验，支持正数目标面数校验，默认不渲染，明确禁止覆盖源文件。
- `BUILDING_OPTIMIZATION_WORKFLOW.md` 已写明单栋准入、固定视角验收、LOD 试验边界、贴图策略、审批和回退要求。

## 回归结果

已通过：

- Node 工程测试：34 项通过，涵盖加载队列、启动错误处理、资源 registry 去重/引用计数/释放、LOD 迟滞与拾取、性能统计、GLB 审计和场景存储。
- `tools/test-import-player.cjs`：加载重试、idle/walk/run、第一/第三人称、速度、斜向输入、碰撞滑动通过。
- `tools/test-import-startup.cjs`：首屏、错误提示、gate tile 优先加载和 bundle 检查通过。
- `tools/qa-import-player.cjs`：真实 Chrome 完整场景通过；人物 66 根骨骼、第三人称 45°俯视、走路/急跑、第一人称隐藏、日夜画面、移动端宽度和资源请求检查通过。
- `tools/qa-player-lighting.cjs`：人物材质接收器、纹理、暖/冷环境光、行走状态和日间关闭外溢通过。
- `tools/qa-import-performance-audit.cjs`：操作使采样失效、销毁清理面板、销毁后拒绝再次启动通过。

浏览器回归截图保存在 `work/player-20261020/`，包括夜景、日景和 390×844 移动端画面。

## Blender 试验状态与限制

本轮没有批准任何批量减面资产进入默认场景。魁星阁原始 GLB 导入 Blender 5.2.1 时曾因 NumPy 在导入阶段尝试分配约 155 MiB 的 int64 临时数组而失败；因此没有把失败过程伪装成可交付的 Blender LOD。已有的旧候选文件只作为审计目录中的历史条目，不代表本轮新生成或已批准。

下一步应在关闭浏览器、确认内存余量后单独运行 `mode audit`，再对同一栋建筑分别生成 LOD0/LOD1/LOD2 候选，并做固定五视角、纹理、法线、夜景、倒影和第一人称近景验收。只有人工确认后才可写入批准 manifest；不能直接对几十栋建筑批处理。

## 后续优先级

1. 先对 tile-09、tile-10 和魁星阁做按可见距离/投影尺寸驱动的生产级 LOD，而不是全场景统一阈值。
2. 建立分区流式加载和显存预算，避免未来新增几十栋高精度建筑时一次性常驻所有高模与全部 LOD。
3. 对倒影、阴影和后处理单独测量 pass 成本，明确它们对提交三角形和 GPU 时间的贡献。
4. 单独做冷启动/暖启动、时代切换和低端设备测试；当前主导入预览页不包含现代/明初时代切换覆盖，因此不能声称该路径已完成时代切换性能验收。
5. 只有在固定视角视觉验收通过后，才测试贴图 2K/1K/512、KTX2 或 Meshopt/Draco，并分别记录解码成本和画质变化。

## 原始证据

- `work/performance-20261020/baseline.json`
- `work/performance-20261020/optimized.json`
- `work/performance-20261020/instrumented.json`
- `work/performance-20261020/assets.json`
- `work/performance-20261020/audit-lifecycle.json`
- `work/player-20261020/player-browser.json`
- `work/player-lighting-20261020/lighting.json`
