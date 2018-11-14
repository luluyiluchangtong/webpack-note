const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// 安装 bundle 代码分析工具，这是第三方的。。
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 使用相关 plugin 时，请记得 require 引入文件。。 
// 代码分离可以做到，按需加载 / 并行加载
module.exports = {
    entry: {
        app: './src/index.js',
        vendor: ["react", "lodash", "angular"] // 指定公共使用的第三方类库
    },  //代码分离方式一：即入口配置多个文件
    output: {
        publicPath: ASSET_PATH,  // 公共路径 ---  为所有资源指定一个基础路径
        filename: 'main.js',
        // filename: '[name].[chunkhash].js',  缓存，即输出时每次都给文件打个标记，下次内容有变化时，
        chunkFilename: '[name].bundle.js',
        // 代码分离方式三： 使用 import语法 分离出 动态导入的 公共模块
        // bundle 分析， 在package.json 中配置 webpack --profile --json > stats.json， 这是官方分析工具
        path: path.resolve(__dirname, 'dist')
        // filename: '[name].bundle.js',
        // path: path.resolve(__dirname, 'dist')  多个入口文件时的 输出文件 情况
        // publicPath: "/"   
        // webpack-dev-middleware 是一个容器(wrapper)，它可以把 webpack 处理后的文件传递给一个服务器(server)。 
        // 它 配合 express 一起使用， 1. 安装它们两个，2.新建一个 server.js  3.webpack.config.js中配置输出路径  4. package.json 中配置启动项 5. npm run server
        // webpack-dev-middleware 下使用 webpack-hot-middleware 启用热更新
    },
    //    optimization: {
    //          splitChunks: {
    //            chunks: 'all'  所有的 chunks 代码公共的部分分离出来成为一个单独的文件
    //          }
    //        },   代码分离方式二：在方式一 的基础上，分分离出公共的模块。
    mode: "production",   // 启用 UglifyJSPlugin 插件, 并在package.json 中设置
    //   "sideEffects": ["./src/some-side-effectful-file.js","*.css"]，
    // 或 "sideEffects": false 
    // 安全地删除文件中未使用的部分
    devtool: 'inline-source-map',  // 将 bundle.js 文件中的错误映射到 源文件中, 生产环境使用 source-map
    devServer: {
        contentBase: './dist',
        hot: true
        // 引入 webpack，配置 hot 字段，引入 Hot 插件， 修改入口为一个文件， 运行时更新各种模块，而无需进行完全刷新
    },
    // 安装 webpack-dev-serve 并告知在哪里查找文件，自动编译并更新文件，不需要每次npm run build
    // 并在 package.json 中启用  "start": "webpack-dev-server --open"
    module: {
        noParse: /jquery|lodash/, // 正则表达式
        // module.noParse 字段，可以用于配置哪些模块文件的内容不需要进行解析
        // 使用 noParse 进行忽略的模块文件中不能使用 import、require、define 等导入机制
        rules: [
            {
                test: /\.css$/,   // 匹配特定条件 
                include: [
                    path.resolve(_dirname, "src")   // 匹配特定路径
                    // 指定哪些路径下的文件需要经过 loader 处理
                    // test 和 include 都用于匹配 resource 路径, 除此之外还有比较少用到的 issuer
                    // 是 resource.test 和 resource.include 的简
                ],
                exclude: {},  // 排除特定路径   Rule.resource.exclude 的简写
                not: [],   // 排除匹配数组中所有条件
                and: [],  // 必须匹配数组中所有条件
                or: [],  // 匹配数组中任意一个条件
                type: 'javascript/esm', // 这里指定模块类型
                use: [
                    'style-loader',  // 是将css-loader 打包好的css代码以<style>标签的形式插入到html文件中
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true, // 使用 css 的压缩功能
                        },
                    },  // 处理css 文件中的  @import 和 url()
                    {
                        loader: 'less-loader',
                        options: {
                            noIeCompat: true,
                        }
                    },  // 从下往上解析，即 less-loader  css-loader  style-loader
                ]       // 如果是内联 import ... 则是从右往左解析
                // 这是同一 rule 下的loader 应用顺序，多个 rule 匹配了同一个模块文件下，可使用 enforce: 'pre/post' 指定解析顺序
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'  // 这样， css 或 js中引用的图片文件将被打包
                    // file-loader 和 url-loader 可以接收并加载任何文件，然后将其输出到 构建目录
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            }
            // json 格式的数据文件默认内置支持，不需要配置, webpack 预加载
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin(['dist']),  // 清理 dist 目录下没有用到的文件，即只会生成用到的文件
        new webpack.HashedModuleIdsPlugin(),
        // 之后 不管再添加任何新的本地依赖，对于每次构建，vendor hash 都应该保持一致
        new HtmlWebpackPlugin({
            title: 'Output Management'
            // title: 'Caching'    缓存， 每次替换为不同的文件名，但是在下次内容无变化时，任然更改文件名，又无缓存的 意义了 。
            // 因此 使用optimization.runtimeChunk 设置为 single，就能创建单个运行时 bundle，此时 缓存了 lodash等文件
            // 若再次修改文件，则会更改 修改过的文件名，未修改的文件名任不变。
        }),  // 在 dist 目录中生成新的 index.html 
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true), // const PRODUCTION = true
            VERSION: JSON.stringify('5fa3b9'), // const VERSION = '5fa3b9'...
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        // DefinePlugin 允许创建一个在编译时可以配置的全局常量。在应用代码文件中，访问配置好的变量了

        // new HtmlWebpackPlugin({
        //     title: 'Output Management'
        //     filename: 'index.html', // 配置输出文件名和路径
        //     template: 'assets/index.html', // 配置文件模板
        //     minify: { // 压缩 HTML 的配置
        //          minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
        //          minifyJS: true // 压缩 HTML 中出现的 JS 代码
        //       }
        //   }),
        // 默认 生成一个 index.html文件，及引入打包好的 js文件。 可传入配置选项，meta 等，，
    ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
};