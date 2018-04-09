// webpack --- js 应用程序的 静态模块打包器（modules bundler）， '递归地'构建一个依赖关系图，然后将这些模块打包成一个或多个 bundle
// 四个核心概念 --- entry  output  loader  plugins
// loader --- loader可以处理非js文件，转换为 应用程序依赖图 可以直接 引用的模块, 在 module.rules中配置loader
// plugins --- 想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中
const webpack = require('webpack');
const config = {
    plugins: [
        new HtmlWebpackPlugin()
    ]
}
module.exports = config;