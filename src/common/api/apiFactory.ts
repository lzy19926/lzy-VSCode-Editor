/*
 * @Author: Luzy
 * @Date: 2023-08-26 00:48:48
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-26 15:43:38
 * @Description: 定义所有暴露出去的主服务API  注入window环境
 */
//! 使用contextBridge模块即可将node进程代码暴露给浏览器沙箱环境

import { IFileService } from "../../common/FileService"
import type { FileTreeNode } from "../../common/FileService"
import { contextBridge } from "electron";
import { accessor } from './ServiceAccessor'
import { ipcRenderer, ipcMain } from "electron"

interface LZY_API {
    readFileTextSync(path: string): Buffer
    getFileTreeFromDir(): Promise<FileTreeNode | undefined>
}

function apiFactory(): LZY_API {

    const extHostFileService = accessor.get(IFileService)

    return {
        readFileTextSync: (path: string) => {
            return extHostFileService.readFileBuffer(path)
        },
        getFileTreeFromDir: () => {
            return extHostFileService.getFileTreeFromDir()
        }
    }
}


// 创建API   并将IPC模块注入到UI中  让其可调用API
declare global {
    interface Window {
        IPC: Electron.IpcRenderer;
    }
}

contextBridge.exposeInMainWorld("IPC", ipcRenderer)
console.log('Inject ipcRenderer SUCCESS');
