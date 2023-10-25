# 一个模拟VSCode原理与架构实现的桌面端个人代码编辑器

## 目录说明

- Common: 公共模块与主线程服务
  - IOC: 用于实现IOC依赖注入逻辑的包, 通过装饰器注入依赖类
  - api: 主进程+服务共享进程暴露出的API整合
  - loader: 用于内部模块管理与AMD代码构建

- Extension: 插件相关

- main: 项目入口

- services: 运行在node进程中的各类服务(包括主进程和共享进程)

- workbench: 编辑器UI部分(运行于浏览器环境)

- workbench-sandbox: 编辑器UI部分构建后代码