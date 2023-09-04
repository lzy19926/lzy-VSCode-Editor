/*
 * @Author: Luzy
 * @Date: 2023-08-25 12:02:51
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-04 21:21:32
 * @Description: 
 */
import * as net from 'net'

/**
 * @description: // 解析query字符串参数为对象
 * @param {string} url 请求url
 */
export function parseUrlQuery(url: string) {
    var obj: Record<string, string> = {};
    var queryString = url.split("?")[1];

    if (queryString) {
        queryString = queryString.split("#")[0];

        var queryArray = queryString.split("&");
        for (var i = 0; i < queryArray.length; ++i) {
            var keyValueArr = queryArray[i].split("=");

            obj[keyValueArr[0]] = keyValueArr[1]
        }
    }

    return obj;
}

/**
 *检查某个端口是否可用（空闲）
*/
export function checkPort(port: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        try {
            const server = net.createServer();

            server.on('error', () => {
                console.log(`The port ${port} is occupied.`);
                resolve(false)
            });

            // 及时关闭可避免增加系统负担
            server.listen(port, () => {
                server.close();
                resolve(true)
            });

        } catch (err) {
            reject(err)
        }
    })

}

/**
 * 从path字符串中解析出文件/文件夹名
*/
export function getFileName(path: string) {
    const segments = path.split(/[\/\\]/);

    let fileName = segments[segments.length - 1];
    if (fileName.includes('?')) {
        fileName = fileName.slice(0, fileName.indexOf('?'));
    }

    return decodeURIComponent(fileName);
}