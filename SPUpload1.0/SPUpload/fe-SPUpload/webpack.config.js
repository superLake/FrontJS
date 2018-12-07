/*
 * @Author: sznews
 * @Date:   2018-10-26 09:32:17
 * @Last Modified by:   sznews
 * @Last Modified time: 2018-11-23 17:32:26
 */
var path = require('path');
var webpack = require('webpack');
// var MiniCssExtractPlugin = require('mini-css-extract-plugin'); --webpack4

//webpack2只支持extract-text-webpack-plugin2.x的版本
//不然会报throw new _ValidationError2.default(ajv.errors, name);
var etwp = require('extract-text-webpack-plugin');
var HTMLWebpackPlugin = require('html-webpack-plugin');
//可视化打包组件
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

//环境变量配置，dev/online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

var getHtmlConfig = function(name, title) {
    return {
        template: './src/view/' + name + '.html',
        filename: 'view/' + name + '.html',
        title: title,
        inject: true,
        hash: true,
        chunks: ['communal',name]//允许哪些chunks进入页面
    }
};

var config = {
    // 入口文件
    entry: {
        'communal':['./src/page/communal/index.js'],
        'user-login':['./src/page/user-login/index.js'],
        // 'user-login-md5': __dirname+'/src/page/user-login/md5.js'
    },
    // 输出文件
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath:'/dist',
    },

    // mode: 'development',
    //loader的引入及设置
    module: {
        rules: [
            // {test: /\.css$/,use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader']},  --webpack4
            {test:/\.css$/,loader:etwp.extract({fallbackLoader:'style-loader', loader:'css-loader'})},
            {test:/\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,loader:'url-loader?limit=1000000&name=resource/[name].[ext]'}
        ],
    },
    //对路径的解析
    resolve: {
        alias: {
            service: path.resolve(__dirname, 'src/service/'),
            util: path.resolve(__dirname, 'src/util/'),
            node_modules:path.resolve(__dirname,'node_modules'),
            page:path.resolve(__dirname,'src/page/'),
            vue$:path.resolve(__dirname,'node_modules/vue/vue.esm.js'),
        }
    },
    // --webpack4
    // optimization:{
    //     splitChunks:{
    //         // chunks:'all',
    //         cacheGroups:{
    //            'communals':{
    //                 chunks:'initial',
    //                 test:/[\\/]communal[\\/]/,
    //                 // path.resolve(__dirname,'common'),
    //                 name:'communals',
    //             },
    //             // default:false, 
    //         } 
    //     }
    // },

    // 插件的使用
    plugins: [
        // new BundleAnalyzerPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name:'communal',
            filename:'js/base.js'
        }),
        new etwp('css/[name].css'),
        // --webpack4
        // new webpack.HotModuleReplacementPlugin(),
        // new MiniCssExtractPlugin({
        //     // Options similar to the same options in webpackOptions.output
        //     // both options are optional
        //     filename: 'css/[name].css',
        //     chunkFilename: '[id].css',
        // }),
        new HTMLWebpackPlugin(getHtmlConfig('user-login', '用户登录')),
    ],

    // webpack-dev-server配置   --webpack4
    // devServer:{
    //     contentBase:'.',
    //     inline:true,
    //     port:8080,
    //     hot:true,
    //     host: "127.0.0.1",
    //     // publicPath:"/assets/"
    // }
};
//webpack2只支持webpack-dev-servser2版本
if ('dev' === WEBPACK_ENV) {
        config.entry.communal.push('webpack-dev-servser/client?http://localhost:8080/');
}

module.exports = config;