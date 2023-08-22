/*
 * @Author: Luzy
 * @Date: 2023-08-21 17:55:21
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 17:35:49
 * @Description: 
 */


import { app } from 'electron';
import { getGlobalCollection, SyncDescriptor } from '../common/IOC/serviceCollection'
import { InstantiationService, IInstantiationService } from '../common/IOC/InstantiationService'
import { WindowApplicationService, IWindowApplicationService } from './WindowApplication';
import type { ServiceCollection } from '../common/IOC/serviceCollection'
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
        const desc = new SyncDescriptor(WindowApplicationService)
        const windowApplication = instantiationService.createInstance<IWindowApplicationService>(desc)

        windowApplication.open()
    }
}


// Main Startup
const code = new CodeMain()
code.main()