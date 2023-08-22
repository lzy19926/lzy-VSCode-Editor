/*
 * @Author: Luzy
 * @Date: 2023-08-21 17:55:21
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 11:16:38
 * @Description: 
 */


import { app, dialog } from 'electron';
import { ServiceCollection, SyncDescriptor } from '../IOC/serviceCollection'
import { InstantiationService, IInstantiationService } from '../IOC/InstantiationService'
import { WindowMainService, IWindowMainService } from './windowMainService';

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


    private async startUp() {
        // 初始化service
        const [services, instantiationService] = this.createServices()

        //todo 初始化IpcServer

        // 打开第一个窗口
        this.openFirstWindow(instantiationService)
    }



    //初始创建并保存第一批服务
    createServices(): [ServiceCollection, InstantiationService] {
        const services = new ServiceCollection()

        const instantiationService = new InstantiationService(services)
        services.set(IInstantiationService, instantiationService)

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