/*
 * @Author: Luzy
 * @Date: 2023-08-21 19:06:07
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 14:00:46
 * @Description: 主窗口模块 对应每个打开的窗口进程
 */
import { app, BrowserWindow } from 'electron';
import { IInstantiationService } from '../common/IOC/InstantiationService'
import { SyncDescriptor } from '../common/IOC/serviceCollection';
import { Workbench } from '../workbench/Workbench'

export class WindowApplicationService implements IWindowApplicationService {

    private _win?: BrowserWindow
    private _id?: number

    // 注入所需子服务实例
    constructor(
        @IInstantiationService instantiationService: IInstantiationService


    ) {
        this.open()
        this.createServices(instantiationService)
        
    }

    // 创建窗口所需的基本服务
    createServices(instantiationService: IInstantiationService) {
        // const services = getGlobalCollection()

    }

    // 打开窗口
    public open() {
        app.whenReady().then(() => {
            this.openEmptyWindow()
        })

    }


    openEmptyWindow() {
        this.createWindow()
        this.load()
    }

    // 创建窗口
    createWindow() {
        this._win = new BrowserWindow({
            width: 800,
            height: 600,
            title: "Lzy_Editor"
        })
        this._id = this._win.id;
    }

    // 加载窗口资源
    load() {
        if (!this._win) return
        this._win.loadURL('E:/VS_Code/myVSCode/src/workbench/static/workbench.html')
    }

    //
}
export interface IWindowApplicationService {
    open(): void
    load(): void
}