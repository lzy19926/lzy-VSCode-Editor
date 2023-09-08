/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-28 15:49:54
 * @Description: 提供内置网络协议管理的服务  浏览器-Node进程通信部分使用该协议(大文件传输)
 */
import { protocol, app } from 'electron';
import { createDecorator } from '../common/IOC/decorator'
import { registerSingleton } from '../common/IOC/serviceCollection'
import { useMVC } from '../common/api/springMVC';
export class ProtocolService {

    schemes: Set<string> = new Set()

    constructor() {
        this.setUp()
    }

    // 创建初始lzy协议
    private setUp() {
        this.createProtocolScheme('lzy')

        app.whenReady().then(() => {
            this.registAndStartScheme('lzy')
        })
    }

    // 创建schema
    private createProtocolScheme(scheme: string = "lzy") {
        protocol.registerSchemesAsPrivileged([
            {
                scheme,
                privileges: {
                    bypassCSP: true,
                    supportFetchAPI: true
                }
            }
        ])
    }

    // 注册scheme为可用 并拦截改协议的请求
    // https://www.electronjs.org/zh/docs/latest/breaking-changes#protocolinterceptbufferprotocol
    private registAndStartScheme(scheme: string = "lzy") {

        protocol.registerStringProtocol(scheme, () => {/**do Nothing*/ })
        protocol.interceptStringProtocol(scheme, useMVC)

        if (this.checkProtocolRegistered(scheme)) {
            this.schemes.add(scheme)
            console.log(`Scheme ${scheme} success in used`)
        }
    }

    // 检查协议是否注册
    private checkProtocolRegistered(scheme: string): boolean {
        return protocol.isProtocolRegistered(scheme)
    }
}

export interface IProtocolService { }

export const IProtocolService = createDecorator<IProtocolService>("IProtocolService")
registerSingleton(IProtocolService, ProtocolService)


