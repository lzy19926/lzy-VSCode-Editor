/*
 * @Author: Luzy
 * @Date: 2023-08-21 17:55:21
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 11:56:04
 * @Description: 
 */


import { app, dialog } from 'electron';
import { getGlobalCollection, SyncDescriptor } from '../IOC/serviceCollection'
import { InstantiationService, IInstantiationService } from '../IOC/InstantiationService'
import { WindowMainService, IWindowMainService } from './windowMainService';
import type { ServiceCollection } from '../IOC/serviceCollection'
import { INlsService } from '../common/NlsService';
import { IFileService } from '../common/FileService';
import { IPerformanceService } from '../common/PerformanceService';
import { IWindowService } from '../common/WindowService';



class CodeMain {

    // 入口启动函数
    main() {
        try {
            this.startUp()
        }
        catch (error: any) {
            console.error(error.message);
            app.exit(1);
        }
    }

    // 
    private async startUp() {
        // 初始化service
        const [services, instantiationService] = this.createServices()

        //todo 初始化IpcServer

        // 打开第一个窗口
        this.openFirstWindow(instantiationService)
    }

    //初始创建并保存第一批服务
    createServices(): [ServiceCollection, InstantiationService] {
        const services = getGlobalCollection()

        const instantiationService = new InstantiationService(services)
        services.set(IInstantiationService, instantiationService)

        const nlsService = instantiationService.createInstance(services.get(INlsService))
        services.set(INlsService, nlsService)

        const fileService = instantiationService.createInstance(services.get(IFileService))
        services.set(IFileService, fileService)

        const performanceService = instantiationService.createInstance(services.get(IPerformanceService))
        services.set(IPerformanceService, performanceService)

        const windowService = instantiationService.createInstance(services.get(IWindowService))
        services.set(IWindowService, windowService)

        return [services, instantiationService]
    }

    // 打开第一个窗口
    openFirstWindow(instantiationService: InstantiationService) {

        // 此时windowMainService即是接口类型
        const desc = new SyncDescriptor(WindowMainService)
        const windowMainService = instantiationService.createInstance<IWindowMainService>(desc)

        windowMainService.open()
    }



}


// Main Startup
const code = new CodeMain()
code.main()