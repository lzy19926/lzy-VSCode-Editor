/*
 * @Author: Luzy
 * @Date: 2023-08-18 15:24:37
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-20 15:42:14
 * @Description: 用于保存Service实例或描述器的集合
 */

import type { ServiceIdentifier } from './decorator'


export class ServiceCollection {
    private _entries = new Map<ServiceIdentifier<any>, any>();

    constructor(...entries: [ServiceIdentifier<any>, any][]) {
        for (const [id, service] of entries) {
            this.set(id, service);
        }
    }

    has(id: ServiceIdentifier<any>): boolean {
        return this._entries.has(id);
    }

    set<T>(id: ServiceIdentifier<T>, descOrInstance: SyncDescriptor<T> | T) {
        this._entries.set(id, descOrInstance);
    }

    get<T>(id: ServiceIdentifier<T>): SyncDescriptor<T> {
        return this._entries.get(id);
    }



    // 注册为单例  传入id和构造函数 创建描述器 后续会使用描述器进行实例化
    registerSingleton<T>(id: ServiceIdentifier<T>, ctor: new (...args: any[]) => T): void {
        const descriptor = new SyncDescriptor(ctor, [])
        this.set(id, descriptor);
    }
}


// 类描述器  保存了构造函数和参数  用于实例化
export class SyncDescriptor<T> {

    readonly ctor: any; // 服务的构造器
    readonly staticArguments: any[];// 静态参数

    constructor(ctor: new (...args: any[]) => T, staticArguments: any[] = []) {
        this.ctor = ctor;
        this.staticArguments = staticArguments;
    }
}













