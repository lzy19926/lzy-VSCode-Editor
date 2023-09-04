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