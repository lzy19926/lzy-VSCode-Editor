/*
 * @Author: Luzy
 * @Date: 2023-08-21 19:06:07
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 11:21:25
 * @Description: 主窗口模块 对应每个打开的窗口进程
 */
import { app, BrowserWindow } from 'electron';
import { IInstantiationService } from '../IOC/InstantiationService'


export class WindowMainService implements IWindowMainService {

    private _win?: BrowserWindow
    private _id?: number

    // 注入所需实例
    constructor(
        @IInstantiationService instantiationService: IInstantiationService
    ) {
        console.log(instantiationService);
        this.open()
    }

    createPart() {

    }

    // 打开窗口
    public open() {
        app.whenReady().then(() => {
            this.createWindow()
            this.load()
        })

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
export interface IWindowMainService {
    open(): void
    load(): void
}