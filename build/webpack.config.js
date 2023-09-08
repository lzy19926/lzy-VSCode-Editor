/*
 * @Author: Luzy
 * @Date: 2023-08-22 15:54:15
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-08 10:48:29
 * @Description: webpack配置  用于单独构建workbench以运行在浏览器环境
 */

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: "none",
    entry: './src/workbench/Workbench.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../workbench-sandbox'),
        libraryTarget: 'amd'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true // 只做类型检查，不生成JavaScript输出文件。
                    }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'bundle.css' }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};