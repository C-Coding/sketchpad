var path = require('path');
var webpack = require('webpack');
var ROOT_PATH = path.resolve(__dirname,'..');

module.exports = {
    //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
    entry: path.join(ROOT_PATH, 'src/index.js'),
    //输出的文件名 合并以后的js会命名为bundle.js
    output: {
        path: path.join(ROOT_PATH, 'docs'),
        filename: 'DrawBoard.js'
    },
    resolve: {
        extensions: ['.js'] // 配置简写，配置过后，书写该文件路径的时候可以省略文件后缀
    },
    devServer: {
        contentBase: './docs',
        // hot:true
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            {
                test: /(\.css|\.less)$/,
                use: ['style-loader', 'css-loader', 'less-loader', "postcss-loader"]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader'
            }
        ],
    }
};