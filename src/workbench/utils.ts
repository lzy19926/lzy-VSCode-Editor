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



/**生成简易字符串hash*/
export function stringHash(str: string): string {
    var hash = 0, i, chr;
    if (str.length === 0) return hash.toString();
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash.toString();
};