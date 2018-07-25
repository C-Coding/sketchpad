const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

const HtmlwebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var ROOT_PATH = path.resolve(__dirname, '..');



module.exports = merge(common, {
    // devtool: 'source-map',
    plugins: [
        new HtmlwebpackPlugin({
            template: path.join(ROOT_PATH, 'index.html')
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            },
            parallel: true
        }),
        new CleanWebpackPlugin(
            path.join(ROOT_PATH, 'dist'),
            {
                allowExternal: true
            }
        )
    ]
});