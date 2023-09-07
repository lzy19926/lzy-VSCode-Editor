/*
 * @Author: Luzy
 * @Date: 2023-08-26 00:48:48
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-28 12:29:22
 * @Description: 定义所有暴露出去的主服务API
 */
//! 使用contextBridge模块即可将node进程代码暴露给浏览器沙箱环境

import { accessor } from './ServiceAccessor'
import { IFileService } from "../../common/FileService"
import { ITerminalService } from '../../common/TerminalService'
import type { FileTreeNode } from "../../common/FileService"


export interface LZY_API {
    readFileTextSync(path: string): string
    readFileBufferSync(path: string): Buffer
    writeFileTextSync(path: string, text: string): void
    getFileTreeFromDir(): Promise<FileTreeNode | undefined>
    createTerminal(): Promise<number>
}

export function apiFactory(): LZY_API {

    const extHostFileService = accessor.get(IFileService)
    const extHostTerminalService = accessor.get(ITerminalService)

    return {
        readFileTextSync: (path: string) => {
            return extHostFileService.readFileText(path)
        },

        readFileBufferSync: (path: string) => {
            return extHostFileService.readFileBuffer(path)
        },

        writeFileTextSync(path: string, text: string) {
            return extHostFileService.writeFileText(path, text)
        },

        getFileTreeFromDir: () => {
            return extHostFileService.getFileTreeFromDir()
        },

        createTerminal: () => {
            return extHostTerminalService.create()
        }
    }
}



