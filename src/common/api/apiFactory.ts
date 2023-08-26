/*
 * @Author: Luzy
 * @Date: 2023-08-26 00:48:48
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-26 17:56:05
 * @Description: 定义所有暴露出去的主服务API
 */
//! 使用contextBridge模块即可将node进程代码暴露给浏览器沙箱环境

import { IFileService } from "../../common/FileService"
import type { FileTreeNode } from "../../common/FileService"
import { accessor } from './ServiceAccessor'


interface LZY_API {
    readFileTextSync(path: string): string
    readFileBufferSync(path: string): Buffer
    getFileTreeFromDir(): Promise<FileTreeNode | undefined>
}

export function apiFactory(): LZY_API {

    const extHostFileService = accessor.get(IFileService)

    return {
        readFileTextSync: (path: string) => {
            return extHostFileService.readFileText(path)
        },
        readFileBufferSync: (path: string) => {
            return extHostFileService.readFileBuffer(path)
        },
        getFileTreeFromDir: () => {
            return extHostFileService.getFileTreeFromDir()
        }
    }
}



