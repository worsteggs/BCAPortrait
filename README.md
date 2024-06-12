脑图谱前端项目

# 文件结构组成

##### Project Structure

```
|—— public                             # 静态资源
    |—— img                            # 图片
    |—— js                             # 第三方js库(不参与打包)
    |—— 1.ico                          # favicon图标
    |—— index.html                     # html模板
|—— src                                # 源代码
    |—— api                            # api请求文件
    |—— assets                         # 字体 图片等静态资源
        |—— brain                      # 脑模型图片
        |—— contact                    # contact页面图标
        |—— img                        # 静态图片
        |—— umap-img                   # 首页ATLAS下相应的UMAP静态图
    |—— components                     # 全局公用组件
        |—— BButton                    # 按钮
        |—— BCharts                    # 图表
            |—— area.vue               # 山脊图
            |—— bar.vue                # 柱形图
            |—— chord.vue              # 弦图
            |—— graph.vue              # 关系图
            |—— heatMap.vue            # 热力图
            |—— pie.vue                # 饼图
            |—— PunchCard.vue          # 气泡图
            |—— scatter.vue            # 散点图
        |—— BMarkDown                  # 渲染md文件
        |—— BPagetitle                 # 页面标题
        |—— BPane                      # 面板
        |—— BPaneTitle                 # 面板标题
        |—— BrainImgWrap               # 首页ATLAS与Gene模块的ATLAS通用样式组件
        |—— BSelect                    # 下拉框
        |—— BUpload                    # 上传
        |—— index.js                   # 组件统一引入
    |—— layout                         # 页面框架布局
        |—— Footer.vue                 # 页脚
        |—— Header.vue                 # 页头(菜单)
        |—— index.vue                  # 页面外层容器
    |—— router                         # 路由
    |—— store                          # 全局store状态管理
    |—— style                          # 全局样式
    |—— utils                          # 公用方法
    |—— views                          # 所有页面 (页面详细说明见下方 Page Structure)
    |—— App.vue                        # 入口页面
    |—— main.js                        # 入口文件 加载组件 初始化等
|—— .editorconfig                      # vscode 编辑器配置
|—— .eslintignore                      # eslint忽略文件配置
|—— .eslintrc.js                       # eslint配置项
|—— .gitignore                         # git提交忽略配置
|—— babel.config.js                    # babel转译配置
|—— package-lock.json                  # 安装包版本锁定文件 (npm安装包时生成)
|—— package.json                       # 安装包信息等
|—— README.md                          # 项目说明
|—— vue.config.js                      # vue-cli配置
|—— yarn.lock                          # 安装包版本锁定文件 (yarn安装包时生成)
```

##### Page Structure

```
|—— view
    |—— cell-sorting
        |—— CellSorting.vue            # Cell Sorting 页面
        |—— components
            |—— CellAnalysis.vue       # Cell Analysis模块组件
            |—— Filters.vue            # Filters 模块组件
            |—— cellType.vue           # Filters 模块中 addFilter CellType类型模块
            |—— Organ.vue              # Filters 模块中 addFilter Organ类型模块
            |—— gene.vue               # Filters 模块中 addFilter Gene类型模块
            |—— metadata.vue           # Filters 模块中 addFilter Metadata类型模块
            |—— filterIcon.vue         # Filters 模块中 图标按钮
            |—— DataDesc.vue           # Data Description 模块组件
            |—— filter-cell-scss.scss  # 样式文件
        |—— index.js                   # 入口index.js 方便路由文件引入页面时省略名字
    |—— contact
        |—— index.vue                  # Contact 页
        |—— index.js                   # 入口index.js 方便路由文件引入页面时省略名字
        |—— components
            |—— teamItem.vue           # 联系人item组件
    |—— dataBrowser
        |—— DataBrowser.vue            # Data Browser 下级页面挂载容器
        |—— AdultBrowser.vue           # Adult brain 页面(引入annotation中的Ciframe组件)
        |—— FetalBrowser.vue           # Fetal brain 页面(引入annotation中的Ciframe组件)
        |—— OrganoidBrowser.vue        # Organoid brain 页面(引入annotation中的Ciframe组件)
        |—— TumourBrowser.vue          # Tumour brain 页面(引入annotation中的Ciframe组件)
        |—— index.js                   # 入口index.js 方便路由文件引入页面时省略名字
    |—— entry
        |—— index.vue                  # 入口页面（已舍弃）
        |—— index.js                   # 入口index.js 方便路由文件引入页面时省略名字
    |—— gene
        |—— index.vue                  # Gene 下级页面挂载容器
        |—— GeneCelltype.vue           # Celltype expression 页面
        |—— GeneMarker.vue             # Marker expression 页面
        |—— GeneTissue.vue             # Tissue expression 页面
        |—— index.js                   # 入口index.js 方便路由文件引入页面时省略名字
    |—— help
        |—— index.vue                  # Help 页面
    |—— index
        |—— index.vue                  # Home 页面
        |—— components
            |—— IndexComp.vue          # Home 页面内容
            |—— Statistics.vue         # Statistics&WELCOME 模块
            |—— atlasBrains.vue        # ATLAS 模块
            |—— brainArea.vue          # Portait页面的脑结构模块
            |—— brainDetails.js        # Portait页面的脑结构模块对应结构详情js
        |—— index.js                   # 入口index.js 方便路由文件引入页面时省略名字
    |—— reference
        |—— Reference.vue              # DataSets 页
        |—— index.js                   # 入口index.js 方便路由文件引入页面时省略名字
```
