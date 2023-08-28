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