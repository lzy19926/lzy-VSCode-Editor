/*
 * @Author: Luzy
 * @Date: 2023-08-25 14:35:42
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-25 14:54:18
 * @Description: 该文件夹定义所有渲染进程需要调用的API
 */


/**
 * @description: 打开文件夹对话框
*/
async function getFileTreeFromDir() {
    return fetch('lzy://api/getFiles')
        .then(response => response.json())
}

/**
 * @description: 获取单个文件内容
*/
async function getFileContent(path: string) {
    return fetch(`lzy://api/getFileContent?path=${path}`)
        .then(response => response.json())
}


export default {
    getFileTreeFromDir,
    getFileContent
}




