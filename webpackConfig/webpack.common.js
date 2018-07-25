var path = require('path');
var webpack = require('webpack');
var ROOT_PATH = path.resolve(__dirname, '..');

module.exports = {
    //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
    entry: path.join(ROOT_PATH, 'src/index.js'),
    //输出的文件名 合并以后的js会命名为bundle.js
    output: {
        path: path.join(ROOT_PATH, 'dist'),
        filename: 'Sketchpad.js'
    },
    resolve: {
        extensions: ['.js'], // 配置简写，配置过后，书写该文件路径的时候可以省略文件后缀
        alias: {
            '@': path.join(__dirname, '../src')
        }
    },

    devServer: {
        contentBase: './dist',
        // hot:true
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            {
                test: /(\.css)$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader' // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                        options: {
                            module: true,
                            localIdentName: '[local][hash:base64:5]'
                        }

                    },
                    {
                        loader: 'less-loader' // compiles Less to CSS
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ],
    }
};