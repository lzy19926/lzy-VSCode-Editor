/*
 * @Author: Luzy
 * @Date: 2023-08-22 15:54:15
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 16:00:49
 * @Description: webpack配置  用于单独构建workbench以运行在浏览器环境
 */

const path = require('path');

module.exports = {
    mode: "none",
    entry: './src/workbench/Workbench.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../workbenchDist'),
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
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};