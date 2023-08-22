/*
 * @Author: Luzy
 * @Date: 2023-08-21 17:55:21
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-21 20:40:08
 * @Description: 
 */


import { app, dialog } from 'electron';
import { ServiceCollection } from '../IOC/serviceCollection'
import { InstantiationService } from '../IOC/InstantiationService'
import { WindowMainService } from './windowMainService';


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
        this.createServices()

        //todo 初始化IpcServer

        // 打开第一个窗口
        this.openFirstWindow()
    }



    //初始创建第一批服务
    createServices() {
        const services = new ServiceCollection()

        const instantiationService = new InstantiationService(services)
    }

    // 打开第一个窗口
    openFirstWindow() {
        new WindowMainService().open()
    }



}


// Main Startup
const code = new CodeMain()
code.main()