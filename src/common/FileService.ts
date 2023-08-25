/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-25 12:11:40
 * @Description: 用于读取和解析文件的服务
 */

import { createDecorator } from './IOC/decorator'
import { registerSingleton } from './IOC/serviceCollection'
import { dialog } from "electron"
import * as fs from 'fs';
import * as path from 'path';

// 文件树类型
type FileTreeNode = {
    isDir: boolean;
    name: string;
    absolutePath: string;
    relativePath: string;
    children: FileTreeNode[];
};

export class FileService {
    constructor() { }

    public getFileBuffer(absolutePath: string): Buffer {
        return fs.readFileSync(absolutePath)
    }

    testOpenFile() {
        dialog.showOpenDialog({
            properties: ['openFile']
        }).then(result => {
            // result.canceled 表示用户是否点了 "取消" 按钮
            if (!result.canceled) {
                const filePaths = result.filePaths; // 返回一个数组，包含选中的所有文件的路径
                console.log(filePaths);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    // 打开对话框 获取文件夹内文件树
    // 渲染进程无法获取系统数据  故在主进程中获取  并于渲染进程通信
    public async getFileTreeFromDir(): Promise<FileTreeNode | undefined> {
        const result = await dialog.showOpenDialog({ properties: ['openDirectory'] })

        return !result.canceled
            ? this.parseFileTree(result.filePaths[0])
            : undefined
    }

    // 创建UI所需的文件树数据
    parseFileTree(rootDir: string): FileTreeNode {

        const rootNode: FileTreeNode = {
            isDir: true,
            name: "MYTEST DIR",
            absolutePath: rootDir,
            relativePath: "",
            children: []
        }

        rootNode.children = this._parseFileTree(rootDir, rootNode)

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
    getFileBuffer(absolutePath: string): Buffer,
    getFileTreeFromDir(): Promise<FileTreeNode | undefined>

}

export const IFileService = createDecorator<IFileService>("IFileService")
registerSingleton(IFileService, FileService)








