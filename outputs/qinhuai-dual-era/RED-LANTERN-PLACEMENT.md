# 临水马头墙 · 红灯笼挂件与独立光效

## 模型

- 原始模型：`E:/soft/inspiration/灯会/model/红灯笼.glb`，只读保留，SHA-256 见 `model-report.json`。
- Blender 工程：`assets/red-lantern/red-lantern-pendant.blend`。
- 页面挂件：`assets/red-lantern/red-lantern-pendant.glb`。
- 灯体含原有装饰按总高 65cm 初始化，新增深铜色 18cm 挂杆；一个挂件网格保留布艺、挂杆两个材质槽。
- `MountPoint` 位于杆顶原点，glTF +Y 为上方。挂杆仅在顶部接触房檐，杆体不发光。
- Blender 降面：625,746 → 4,543 三角面；保留原彩绘 UV，贴图最大 1024px。

## 地图挂载

共 101 盏，仅使用已有 `matou-ma61/manifest.json` 的 9 组白名单；北岸混合网格依旧受 `minX=13` 限制。

| 建筑组 | 挂件数量 |
|---|---:|
| north-west | 15 |
| north-east | 12 |
| north-east-end | 7 |
| south-west | 17 |
| south-center | 12 |
| south-east | 15 |
| south-east-shop | 12 |
| south-east-pair | 9 |
| south-east-end | 2 |

- 截图指定的 north-west 二层朝河面檐口新增 5 盏，整排等距；浅檐处增加短铜色外伸挂架避开窗面，沿用独立红灯笼光效。
- 使用已审计的檐口线生成规则间距候选，端部留空，避开柱墙；适配实际弯曲檐沿，不跨空缺补灯。
- 每个挂点向上求交选定屋面底部，顶部仅有微量接触容差；沿真实灯体轮廓分 32 个高度区间作保守包围盒碰撞检查。
- 包围盒与原 tile 三角形使用分离轴法检测；挂杆单独检查；灯体上部和中部向河面作可见性射线检查，剔除被檐沿挡住的点。
- `placement-audit.json` 和 `layout.json` 保留坐标、数量与几何检查结果。
- 复用地图既有米制换算 `0.53 / 1.65`，不改变城区模型大小。

## 独立控制

入口：`building-light-study.html?building=matou`，右侧“红灯笼光效”。“近看红灯笼挂点”可检查顶部连接。

| 控件 | 范围 | 默认 |
|---|---|---|
| 启用 | 开 / 关 | 开 |
| 灯体亮度 | 0–3 倍 | 0.85 |
| 色温 | 1800–6500 K | 2800 K |
| 外溢范围 | 0.3–3 m | 1.25 m |
| 光晕强度 | 0–1.5 倍 | 0.35 |
| 照亮房檐 | 独立开关 | 开 |
| 照亮墙面 | 独立开关 | 开 |

- 灯体通过原彩绘贴图自发光；挂杆维持普通铜材质。光晕为独立柔和图层。
- 檐墙反照为独立叠加网格，只复制范围内的接收面；不替换、不改写建筑材质或原有光照 shader。
- 不新增逐灯点光源，不修改曝光、全局 bloom、环境光、建筑方案或花灯方案。
- 关闭光效保留实体挂件。白天、线框模式自动关闭红灯笼发光、反照与光晕。
- 参数使用独立的浏览器存储键 `qinhuai.red-lantern-light.v1`，自动恢复并同步同源主地图标签页。它不属于建筑方案库，也不是服务器存档。
- 切换至非马头墙建筑会移除整层挂件并禁用该模块。灯笼载入失败时保留建筑预览，提供重试。
- 主地图新增“临水檐下 · 红灯笼”视角与试灯入口。

## 再生成与验证

```powershell
E:/blender/blender.exe --background --python tools/blender_red_lantern.py
C:/Users/Lonn/anaconda3/python.exe -X utf8 tools/build_red_lantern_layout.py
E:/node/node.exe tools/build-import-viewer.cjs
E:/node/node.exe node_modules/esbuild/bin/esbuild game/building-study/study.js --bundle --minify --format=iife --target=chrome100 --outfile=game/building-study/study.bundle.js
E:/node/node.exe tools/test-red-lantern.mjs
E:/node/node.exe tools/qa-red-lantern.cjs
```

浏览器验证与截图：`work/red-lantern-20261019/`。回归覆盖主地图启动、马头墙原灯光及材质、夫子庙和魁星阁原有方案。
