const path=require('path');

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

var HtmlwebpackPlugin = require('html-webpack-plugin');
var vConsolePlugin = require('vconsole-webpack-plugin');


var ROOT_PATH = path.resolve(__dirname,'..');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './docs'
    },
    //添加我们的插件 会自动生成一个html文件
    plugins: [
        new HtmlwebpackPlugin({
            template: path.join(ROOT_PATH, 'index.html')
        }),
        new vConsolePlugin({
            enable: true // 发布代码前记得改回 false
        }),
        // new webpack.HotModuleReplacementPlugin()
    ]
});