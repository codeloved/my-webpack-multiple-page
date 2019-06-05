1.利用webpack打包多页应用, 基于webpack4
功能: 
1.js相关功能,使用babel, babel-polyfill, 全面支持es6+最新语法
2.css相关功能,支持less语法,支持自动添加浏览器前缀,css压缩,单独提取css文件,入口文件为js文件,想要css打包,必须要在对应的入口文件import less文件才会打包
3.支持manifest.json,md5文件对照表
4.支持webpack-dev-server
5.支持全局使用jquery,不需要另外导入