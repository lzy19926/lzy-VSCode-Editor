/*
 * @Author: Luzy
 * @Date: 2023-09-07 19:01:53
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-07 19:40:57
 * @Description: 这里定义了所有通过界面发出的命令 如打开文件等
 */


import { IEditorPart } from "../parts/Editor";
import { IFileTabPart } from "../parts/FileTab";
import { ITextFileService } from "../services/TextFileService"
import { CommandsRegistry } from "./CommandsRegistry";
import { accessor } from '../api/BroswerServiceAccessor'

// Services
const editorService = accessor.get(IEditorPart)
const textFileService = accessor.get(ITextFileService)
const fileTabPart = accessor.get(IFileTabPart)



// 读取单个文件内容
async function loadFileContent(path: string) {
    const isCurrentModel = editorService.getCurrentModel()?.id == path
    if (isCurrentModel) return

    const model = await textFileService.getFileModel(path)
    editorService.loadFileModel(model)
    fileTabPart.focus(path)
}




CommandsRegistry.registerCommand({
    id: 'workbench.action.loadFileContent',
    handler: loadFileContent
});