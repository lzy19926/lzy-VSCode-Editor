

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