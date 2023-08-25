/*
 * @Author: Luzy
 * @Date: 2023-08-18 15:24:37
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-26 01:06:48
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

    set<T>(id: ServiceIdentifier<T>, descOrInstance: SyncDescriptor<T> | any) {
        this._entries.set(id, descOrInstance);
    }

    get<T>(id: ServiceIdentifier<T>): SyncDescriptor<T> | T {
        return this._entries.get(id);
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


// 
const globalServiceCollection = new ServiceCollection()

// 注册为单例  传入id和构造函数 创建描述器 后续会使用描述器进行实例化
export function registerSingleton<T>(id: ServiceIdentifier<T>, ctor: new (...args: any[]) => T): void {
    const descriptor = new SyncDescriptor(ctor, [])
    globalServiceCollection.set(id, descriptor);
}

export function getGlobalCollection(): ServiceCollection {
    return globalServiceCollection
}












