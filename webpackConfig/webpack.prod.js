const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

const HtmlwebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname, '..');



module.exports = merge(common, {
    // devtool: 'source-map',
    plugins: [
        new HtmlwebpackPlugin({
            template: path.join(ROOT_PATH, 'index.html')
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['$super', '$', 'exports', 'require']
                //以上变量‘$super’, ‘$’, ‘exports’ or ‘require’，不会被混淆
            },
            compress: {
                warnings: false
            },
            // sourceMap: true
        }),
        new CleanWebpackPlugin(
            path.join(ROOT_PATH, 'dist'),
            {
                allowExternal: true
            }
        )
    ]
});