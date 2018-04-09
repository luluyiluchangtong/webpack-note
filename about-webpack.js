// webpack --- js 应用程序的 静态模块打包器（modules bundler）， '递归地'构建一个依赖关系图，这个依赖图包含着应用程序所需的每个模块，然后将这些模块打包成一个或多个 bundle
// webpack的配置文件是 导出一个对象的 js 文件。 还可以导出多个配置对象。
// 模块解析: resolver 是一个库(library)，用于帮助找到模块的绝对路径, webpack 使用 enhanced-resolve 来解析文件路径: 绝对路径，相对路径，模块路径
// resolveLoader 用来解析 loader
// 构建目标 target --- 即针对 服务器 或 浏览器环境下的构建方式(配置).
module.exports = {
    target: 'node'
}
var serverConfig = {
    target: 'node',
    output: {}
}
var clientConfig = {
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist'),
        pathname: ''
    }
}
// runtime --- 浏览器运行时，用来 连接模块 的的所有代码。  manifest --- 解析模块时，所有模块的信息集合。通过使用 manifest 中的数据，runtime 将能够查询模块标识符，检索出背后对应的模块。
// 缓存 --- 没有观察者模式下，每次编译必须清理缓存。有观察者模式下，修改过的文件会从缓存中剔除。
// 模块热替换（HMR） ---  在应用程序运行过程中替换、添加或删除模块，而无需重新加载整个页面

// 四个核心概念 --- entry  output  loader  plugins
// entry --- 应用哪个模块构建内部依赖图的开始。 可以使用 对象语法 创建多个 主入口   CommonsChunkPlugin 确保每个文件具有唯一的名称
// 每个 HTML 页面都有一个入口起点。单页应用(SPA)：一个入口起点，多页应用(MPA)：多个入口起点  动态入口？？
const config = {
    entry: {
        app: '',
        vendor: ''
    }
}
// 多页面应用程序  --- 3个独立分离的依赖图
const config = {
    entry: {
        pageOne: '',
        pageTwo: '',
        pageThree: ''
    }
}
// output ---  （output.path）哪里输出所创建的 bundle，  (output.filename)以及如何命名。
const config = {
    entry: {},
    output: {
        path: '',
        filename: ''
    }
}
// loader --- loader可以处理非js文件，转换为 应用程序依赖图 可以直接 引用的模块, 在 module.rules中配置loader
const config = {
    module: {
        rules: [
            { test: '', use: '' }
        ]
    }
}
// plugins --- 想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中。 插件目的在于解决 loader 无法实现的其他事
const webpack = require('webpack');
const config = {
    entry: {},
    output: {},
    plugins: [
        new HtmlWebpackPlugin()
    ]
}
module.exports = config;


// 指南：
// 新建文件 webpack-demo, 
// npm init -y生成 package.json,
// 本地安装 webpack, 然后安装 webpack-cli （命令行接口）
// 运行 npx webpack,生成 bundle.js.   index.html中引入 bundle.js

// 新建 webpack.config.js 文件 取代 CLI的方式来配置文件。
// npx webpack --config webpack.config.js 通过webpack.config.js方式 来构建一次，这种方式比 CLI更灵活。
//  --- 这里可以传递任何名称的 配置文件，例如拆分成多个复杂的配置文件：webpack.dev.js  webpack.common.js等。。
// 使用 npm run build 代替 CLI 来运行 webpack会更方便 --- 修改package.json中的scripts

// 管理资源：
// 使用 loader 转换 css，字体文件， 图片，数据(其中json格式内置支持) 等资源。。 （安装相关loader，配置config，在入口模块/引入依赖资源，并使用）
// npm install --save-dev style-loader css-loader
// npm install --save-dev file-loader
// npm install --save-dev csv-loader xml-loader
// 这种将资源和模块组合在一起的方式，具有可移植性！

// 管理输出：
// 多个 入口起点 输出多个 bundle 的情况下，怎么办？
// 修改 entry添加多个入口起点； output 根据起点名称  动态生成 bundle名称 
// 最后 index.html 引入  app.bundle.js  print.bundle.js

// 如果更改 入口文件 的名称时，在构建结果中会重命名，但是 index.html 不会跟新文件名，所以引入 HtmlWebpackPlugin 插件，使得构建时重新生成的 index.html 文件替换原来的。
// 插件的使用方式：安装插件 npm install --save-dev html-webpack-plugin, 在config 中 require插件，plugins 中配置插件
// 为了每次构建前清理 dist 文件夹， 安装 clean-webpack-plugin 插件， 先require， 再配置 plugins
// 此时，再次构建项目， dist中旧的文件没有了。

// 开发：
// 使用 source map 追踪 错误和警告 在源代码中的原始位置。






