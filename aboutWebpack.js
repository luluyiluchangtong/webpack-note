
// webpack的 四个核心概念： entry  output  loader  plugins
// 依赖图，从入口起点开始，递归的构建一个依赖图。这个依赖图包含着应用程序所需的每个模块，然后将所有这些模块打包为少量的 bundle - 通常只有一个 - 可由浏览器加载。

const path = require('path');   // 别忘了应用 nodeJS 的路径模块
module.exports = {
    target: "node",    // 使用什么环境下的 方式 加载模块， 默认是 web，使用的是内建的模块 fs / path；node 使用的是 require
    mode: 'production',
    // webpack 默认是 production 模式， 不同模式 告知 webpack 使用相应模式的 '内置优化'   除此还有 development / none， 启用模式相当于启用了相应的插件 plugins
    entry: './path/to/my/entry/file.js',
    // 当创建多个路径数组时，会有多个主入口：
    // 数组语法： entry: ['./path/to/my/entry/file.js', './path/to/my/entry/file.js']  不易扩展配置

    // 对象语法： entry: {app: './src/app.js', vendors: './src/vendors.js'}     易扩展配置          
    //  app：应用程序入口， vendor：第三方库入口， 该方式适用于  '单页应用程序'
    //           entry: { pageOne: './src/pageOne/index.js', pageTwo: './src/pageTwo/index.js', pageThree: './src/pageThree/index.js' }
    // 该方式适用于  '多页应用程序'


    output: {
        filename: 'bundle.js',
        path: '/home/proj/public/assets'
    },
    // output: {
    //     filename: '[name].js',
    //     path: __dirname + '/dist'
    //   }

    // 输出的 配置 只有一个！只是针对多个主入口时，出口的配置需要使用占位符，确保每个文件都有唯一的名称。。

    // loader  webpack 自身只支持 JavaScript。而 loader 能够让 webpack 处理那些非 JavaScript 文件， loader能够处理任何类型的模块
    module: {
        rules: [
            { test: /\.css$/, use: 'css-loader' },
            { test: /\.ts$/, use: 'ts-loader' }
        ]
    },

    // 安装 css-loader  ts-loader
    // loader 可以使你在 import 或"加载"模块时  预处理文件 。
    // 使用 loader 的三种方式：  
    // 1. module.rules     webpack.config.js 配置文件中使用
    // 2. import Styles from 'style-loader!css-loader?modules!./styles.css';   内联代码使用
    // 3. webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'   webpack的 CLI 中使用。
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' })    // HtmlWebpackPlugin 时 webpack 的内置插件
    ]
    // 使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中
    // 使用插件目的在于解决 loader 无法实现的其他事
}


// module.exports = {
//     // 导出一个配置对象，
//     // 导出多个配置对象
//     // 导出为一个函数
//     // 导出为一个 Promise 
// }

// 模块解析：
// 引入模块 --- resolver库 帮助 webpack 找到 bundle 中需要引入的模块代码，
// 打包模块 --- enhanced-resolve库 帮助 webpack  当打包模块时，解析文件路径
// 使用 enhanced-resolve  ，webpack 能够解析三种文件路径：绝对路径， 相对路径， 模块路径

// runtime --- 浏览器运行时，用来 连接模块 的的所有代码。  manifest --- 解析模块时，所有模块的信息集合。通过使用 manifest 中的数据，runtime 将能够查询模块标识符，检索出背后对应的模块。

// 模块热替换(HMR - Hot Module Replacement)功能会在应用程序 运行过程中 替换、添加或删除模块，而无需重新加载整个页面

