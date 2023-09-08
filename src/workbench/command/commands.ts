/*
 * @Author: Luzy
 * @Date: 2023-09-07 19:01:53
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-07 20:15:48
 * @Description: 这里定义了所有通过界面发出的命令 如打开文件等
 */


import { IEditorPart } from "../parts/Editor";
import { IFileTabPart } from "../parts/FileTab";
import { ISideBarPart } from "../parts/SideBar";
import { IEditorModelService } from "../services/EditorModelService"
import { IIPCRendererService } from "../services/IPCRendererService";
import { CommandsRegistry } from "./CommandsRegistry";
import { accessor } from '../api/BroswerServiceAccessor'

// Services
const editorService = accessor.get(IEditorPart)
const editorModelService = accessor.get(IEditorModelService)
const fileTabPart = accessor.get(IFileTabPart)
const sideBarPart = accessor.get(ISideBarPart)
const ipcRendererService = accessor.get(IIPCRendererService)


// 读取单个文件内容
async function loadFileContent(path: string) {
    const isCurrentModel = editorService.getCurrentModel()?.id == path
    if (isCurrentModel) return

    const model = await editorModelService.getFileModel(path)
    editorService.loadFileModel(model)
    fileTabPart.addOrFocuseTabItem(model.id)
}


// 按钮事件 获取并加载文件树
async function pickFolderAndOpen(event: Event) {
    const res = await ipcRendererService.invokeAPI("getFileTreeFromDir")
    const fileTree = res
    sideBarPart.renderFileList(fileTree)
}



CommandsRegistry.registerCommand({
    id: 'workbench.action.loadFileContent',
    handler: loadFileContent
});

CommandsRegistry.registerCommand({
    id: 'workbench.action.pickFolderAndOpen',
    handler: pickFolderAndOpen
});