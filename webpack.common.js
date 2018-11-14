const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WorkboxPlugin = require('workbox-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin') // 那些未经过webpack 处理到那时想要出现在 dist 目录下的文件
// const ExtractTextPlugin = require('extract-text-webpack-plugin')  提取 css文件 出来到 dist 目录下·
// 这是为了方便缓存 css 文件。。
// webpack 内置插件 new webpack.ProvidePlugin();       new webpack.IgnorePlugin()
// 图片雪碧图： 配合使用 postcss 和 postcss-sprites，才能实现 CSS Sprites 的相关构建。
module.exports = {
    entry: {
        app: './src/index.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',  // 是将css-loader 打包好的css代码以<style>标签的形式插入到html文件中
                    'css-loader'  // 处理css 文件中的  @import 和 url()
                ]
            },
            // {
            //     test: /\.css$/,
            //     // 因为这个插件需要干涉模块转换的内容，所以需要使用它对应的 loader
            //     use: ExtractTextPlugin.extract({
            //         fallback: 'style-loader',
            //         use: 'css-loader',
            //     }),
            // },

            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Progressive Web Application'
        }),
        new webpack.HashedModuleIdsPlugin(),
        // 之后 不管再添加任何新的本地依赖，对于每次构建，vendor hash 都应该保持一致
        new WorkboxPlugin.GenerateSW({
            // 这些选项帮助 ServiceWorkers 快速启用
            // 不允许遗留任何“旧的” ServiceWorkers
            clientsClaim: true,
            skipWaiting: true
        }),
        // new ExtractTextPlugin('index.css'),
        // new CopyWebpackPlugin([
        //     { from: 'src/file.txt', to: 'build/file.txt', }, // 顾名思义，from 配置来源，to 配置目标路径
        //     { from: 'src/*.ico', to: 'build/*.ico' }, // 配置项可以使用 glob
        //     // 可以配置很多项复制规则
        // ])
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),  // webpack 的内置模块， 自动加载模块，而不必到处 import 或 require 。代码中就可以直接使用 $ jQuery 操作了
        // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/) 
        // 这个插件用于忽略某些特定的模块，让 webpack 不把这些指定的模块打包进去
    ],

    output: {
        filename: '[name].[hash].js',
        // chunkFilename: '[name].bundle.js',  动态导入的模块
        path: path.resolve(__dirname, 'dist')
    }
};