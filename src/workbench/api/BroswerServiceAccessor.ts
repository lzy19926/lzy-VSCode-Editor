/*
 * @Author: Luzy
 * @Date: 2023-08-26 14:22:25
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-07 19:20:45
 * @Description: 通过该类确保直接获取创建API所需的service实例
 * 通过serviceCollection获取的可能是描述器而不是实例 
 */


import { IEditorPart } from "../parts/Editor";
import { IFileTabPart } from "../parts/FileTab";
import { ITextFileService } from "../services/TextFileService"
import { ServiceIdentifier } from "../../common/IOC/decorator"
import { InstantiationService } from "../../common/IOC/InstantiationService";
import { SyncDescriptor, getGlobalCollection } from "../../common/IOC/serviceCollection";


class BroswerServiceAccessor {

    _services: Map<ServiceIdentifier<any>, any> = new Map()

    // 注入API所需的服务实例储存起来
    constructor(
        @IEditorPart private readonly editorPart: IEditorPart,
        @IFileTabPart private readonly fileTabPart: IFileTabPart,
        @ITextFileService private readonly textFileService: ITextFileService,
    ) {
        this._services.set(IEditorPart, editorPart)
        this._services.set(IFileTabPart, fileTabPart)
        this._services.set(ITextFileService, textFileService)
    }

    get<T>(id: ServiceIdentifier<T>): T {
        const instance = this._services.get(id)
        if (!instance) {
            console.error(`Service ${id.toString()} should be injected in Accessor`)
        }
        return instance
    }
}


const instanService = new InstantiationService(getGlobalCollection())
export const accessor = instanService.createInstance(new SyncDescriptor(BroswerServiceAccessor))



