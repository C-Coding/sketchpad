const path = require('path');
const config = require('../config');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

var HtmlwebpackPlugin = require('html-webpack-plugin');
var vConsolePlugin = require('vconsole-webpack-plugin');


var ROOT_PATH = path.resolve(__dirname, '..');

const devWebpackConfig = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './docs'
    },
    //添加我们的插件 会自动生成一个html文件
    plugins: [
        new HtmlwebpackPlugin({
            template: path.join(ROOT_PATH, 'index.html')
        })
        // new webpack.HotModuleReplacementPlugin()
    ]
});


if (config.dev.vconsole) {
    devWebpackConfig.plugins.push(
        new vConsolePlugin({
            enable: true
        }),
    )
}

module.exports = devWebpackConfig;