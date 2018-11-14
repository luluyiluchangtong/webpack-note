
// webpack的 四个核心概念： entry  output  loader  plugins
// 入口 ---  webpack配置 --- 打包生成 出口
// 依赖图，从入口起点开始，递归的构建一个依赖图。这个依赖图包含着应用程序所需的每个模块，然后将所有这些模块打包为少量的 bundle - 通常只有一个 - 可由浏览器加载。
// 安装：npm i webpack -S   npm i webpack-cli -S(webpack v4+ 版本需要额外安装的) 
// 使用配置文件： 使用配置文件 webpack.config.js   代替 cli 命令行的方式
// 使用 npm 命令行代替 webpack 命令行： package.json 的 script里配置后， 使用 npm run build 运行 webpack，代替 webpack 的 npx webpack --config webpack.config.js
// 生产环境 和 开发环境配置不同，因此需要将 pro, dev，环境下的配置分开，同时给个公用的 配置文件
// 同时 安装 webpack-merge 插件, 同时修改 package.json
// 项目依赖安装的 webpack 使用 npm 命令， 全局的可以使用 webpack全局命令
// webpack 的配置其实是一个 Node.js 的脚本，这个脚本对外暴露一个配置对象，webpack 通过这个对象来读取相关的一些配置
// webpack 中有一个很关键的模块 enhanced-resolve 就是 处理 依赖模块 路径的解析
// 解析 相对路径  绝对路径  解析模块名, 通过 resolve:{alias, extensions, modules, mainFiles, resolveLoader }  来配置
// 如何在配置文件中区分环境来应用不同的配置选项： 1.导出一个函数  2.拆分配置文件
// 模块热替换 HRM (局部刷新) --- Hot Module Replacement；  
// 热加载（整页刷新） --- Hot Reloading 
// 处理图片的 插件 file-loader   image-webpack-loader(压缩)  postcss 和 postcss-sprites（雪碧图）  url-loader（对小图片的Base64编码）

//    env.NONE_ENV    env.production
// 环境变量 webpack --env.NODE_ENV=local --env.production --progress
// 使用 env 变量，你必须将module.exports转换成一个函数
// module.exports= env=>{
//     console.log('NODE_ENV: ', env.NODE_ENV); // 'local'
//     console.log('Production: ', env.production); // true
// return {
//     entry: './src/index.js',
//     output: {
//       filename: 'bundle.js',
//       path: path.resolve(__dirname, 'dist')
//     }
//   };
// }

const path = require('path');   // 别忘了应用 nodeJS 的路径模块
module.exports = {
    target: "node",    // 使用什么环境下的 方式 加载模块， 默认是 web，使用的是内建的模块 fs / path；node 使用的是 require
    mode: 'production',   // production 是压缩后输出，即 bundle 文件时压缩过的。  development 是生产模式的输出
    // webpack 默认是 production 模式， 不同模式 告知 webpack 使用相应模式的 '内置优化'   除此还有 development / none， 启用模式相当于启用了相应的插件 plugins
    // 还可以使用内置的 DefinePlugin 指定环境
    entry: './path/to/my/entry/file.js',
    // 当创建多个路径数组时，会有多个主入口：
    // 数组语法： entry: ['./path/to/my/entry/file.js', './path/to/my/entry/file.js']  不易扩展配置

    // 对象语法： entry: {app: './src/app.js', vendors: './src/vendors.js'}     易扩展配置          
    //  app：应用程序入口， vendor：第三方库入口， 该方式适用于  '单页应用程序'
    //           entry: { pageOne: './src/pageOne/index.js', pageTwo: './src/pageTwo/index.js', pageThree: './src/pageThree/index.js' }
    // 该方式适用于  '多页应用程序'
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' }),  // HtmlWebpackPlugin 时 webpack 的内置插件
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true), // const PRODUCTION = true
            VERSION: JSON.stringify('5fa3b9'), // const VERSION = '5fa3b9'...
            'process.env.NODE_ENV': JSON.stringify('production')
        })
        // DefinePlugin 允许创建一个在编译时可以配置的全局常量。在应用代码文件中，访问配置好的变量了
    ],
    output: {
        filename: 'bundle.js',
        path: '/home/proj/public/assets'
    },
    // output: {
    //     filename: '[name].js',
    //     path: __dirname + '/dist'
    //   }


    // 输出的 配置 只有一个！只是针对多个主入口时，出口的配置需要使用占位符，确保每个文件都有唯一的名称。。
    // webpack 动态打包 所有依赖，避免打包 未使用依赖。

    // loader  webpack 自身只支持 JavaScript。而 loader 能够让 webpack 处理那些非 JavaScript 文件， loader能够处理任何类型的模块
    module: {
        rules: [
            { test: /\.css$/, use: 'css-loader' },
            { test: /\.ts$/, use: 'ts-loader' },
            {
                test: /.*\.(gif|png|jpe?g|svg|webp)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }
                ]
            },   // 除此还可以使用 image-webpack-loader 来压缩图片
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192, // 单位是 Byte，当文件小于 8KB 时作为 DataURL 处理
                        },
                    }
                ]
            },

            // 安装 css-loader  ts-loader
            // loader 可以使你在 import 或"加载"模块时  预处理文件 。
            // 使用 loader 的三种方式：  
            // 1. module.rules     webpack.config.js 配置文件中使用
            // 2. import Styles from 'style-loader!css-loader?modules!./styles.css';   内联代码使用
            // 3. webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'   webpack的 CLI 中使用。

            // 使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中
            // 使用插件目的在于解决 loader 无法实现的其他事
        ]
    }
    // process.env.NODE_ENV
    // process.env.NODE_ENV === 'production' ? '[name].[hash].bundle.js' : '[name].bundle.js' 
    // 这样的条件语句，在 webpack 配置文件中，无法按照预期运行。

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

    // runtime ---   浏览器运行时，用来 '连接模块' 的的所有代码。  
    // manifest --- '解析模块' 时，所有模块的信息集合。通过使用 manifest 中的数据，runtime 将能够查询模块标识符，检索出背后对应的模块。

    // 模块热替换(HMR - Hot Module Replacement)功能会在应用程序 运行过程中 替换、添加或删除模块，而无需重新加载整个页面
    // webpack-dev-middleware  和  webpack-dev-middleware

    // Loaders
    // {test:/\.css$/, use: ['style-loader', 'css-loader']},  require("style-loader!css-loader!sass-loader!./my-styles.sass");
    // loader 的加载是 从右向左的。。即 先 sass-loader 再 css-loader 最后 style-loader
    // css-loader 处理css 中的  @import 和 url()
    // style-loader  是将css-loader 打包好的css代码以<style>标签的形式插入到html文件中

    // 使用 new ExtractTextPlugin(options: filename | object) 插件  extract-text-webpack-plugin
    // 如果你的样式文件大小较大，这会做更快提前加载，因为 CSS bundle 会跟 JS bundle '并行加载'。

    // 将 资源和代码 放在一起，更方便移植，即代替将 全部资源 放在 asset 里

    // 创建 library  ？？
    // shimming 引用全局变量时需要用到。。
}