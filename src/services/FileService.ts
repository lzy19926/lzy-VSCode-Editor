/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-08 11:05:26
 * @Description: 用于读取和解析文件的服务
 */

import { createDecorator } from '../common/IOC/decorator'
import { registerSingleton } from '../common/IOC/serviceCollection'
import { getFileName } from '../common/utils';
import { dialog } from "electron"
import * as fs from 'fs';
import * as path from 'path';

// 文件树类型
export type FileTreeNode = {
    isDir: boolean;
    name: string;
    absolutePath: string;
    relativePath: string;
    children: FileTreeNode[];
};

export class FileService {
    dialog: Electron.Dialog
    constructor() {
        this.dialog = dialog
    }

    public readFileBuffer(path: string): Buffer {
        return fs.readFileSync(decodeURIComponent(path))
    }

    public readFileText(path: string, charset: BufferEncoding = "utf-8"): string {
        return fs.readFileSync(decodeURIComponent(path)).toString(charset)
    }

    public writeFileText(path: string, text: string): void {
        return fs.writeFileSync(decodeURIComponent(path), text)
    }

    // 打开对话框 获取文件夹内文件树 渲染进程无法获取系统数据  故在主进程中获取
    public async getFileTreeFromDir(): Promise<FileTreeNode | undefined> {
        const result = await this.dialog.showOpenDialog({ properties: ['openDirectory'] })
        return !result.canceled
            ? this.parseFileTree(result.filePaths[0])
            : undefined
    }

    // 创建UI所需的文件树数据
    parseFileTree(rootDirPath: string): FileTreeNode {

        const rootNode: FileTreeNode = {
            isDir: true,
            name: getFileName(rootDirPath).toUpperCase(),
            absolutePath: rootDirPath,
            relativePath: "",
            children: []
        }

        rootNode.children = this._parseFileTree(rootDirPath, rootNode)

        return rootNode
    }

    _parseFileTree(folderPath: string, parentNode?: FileTreeNode): FileTreeNode[] {
        const fileList = fs.readdirSync(folderPath);

        return fileList.map((item) => {
            const absolutePath = path.join(folderPath, item);
            const stats = fs.statSync(absolutePath);

            const node: FileTreeNode = {
                isDir: stats.isDirectory(),
                name: item,
                absolutePath,
                relativePath:
                    parentNode != null
                        ? path.relative(parentNode.absolutePath, absolutePath)
                        : '',
                children: []
            };

            if (node.isDir) {
                node.children = this._parseFileTree(absolutePath, node); // Recursively iterate over child directories.
            }

            return node;
        });
    }

}

export interface IFileService {
    readFileBuffer(path: string): Buffer
    readFileText(path: string, charset?: BufferEncoding): string
    writeFileText(path: string, text: string): void
    getFileTreeFromDir(): Promise<FileTreeNode | undefined>
}

export const IFileService = createDecorator<IFileService>("IFileService")
registerSingleton(IFileService, FileService)








