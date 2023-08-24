/*
 * @Author: Luzy
 * @Date: 2023-08-20 15:32:08
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-24 15:32:02
 * @Description: 提供注入依赖逻辑并实例化的服务,使用该服务实例化其他服务
 */


import type { ServiceIdentifier, Dependency } from './decorator'
import { SyncDescriptor, ServiceCollection } from './serviceCollection'
import { createDecorator } from './decorator'

type StackNode = {
    name: string
    id: ServiceIdentifier<any>
    desc: SyncDescriptor<any>
}


// 检查是实例还是描述符
function checkDescOrInstance(descOrInstance: any) {
    const isDesc = (descOrInstance instanceof SyncDescriptor)
    if (isDesc) {
        return "desc"
    }
    else if (typeof descOrInstance !== 'undefined' && !isDesc) {
        return "instance"
    } else {
        return "unknow"
    }
}

// 实例化服务, 用于将单个服务进行实例化,并提供注入依赖逻辑
export class InstantiationService {
    constructor(
        private readonly _services: ServiceCollection
    ) { }

    public createInstance<T>(descriptor: SyncDescriptor<T>): T {
        const ctor = descriptor.ctor  // 构造函数
        const staticArgs = descriptor.staticArguments // 静态参数
        const serviceArgs: any[] = [];                // 注入的Services


        // 将装饰器注入的服务取出并进行实例化
        // 装饰器保存依赖描述符到数组中
        const serviceDependencies = ctor["id$dependences"] || []

        for (const dependency of serviceDependencies) {
            const service = this.getOrCreateServiceInstance(dependency)
            // 注意这里的构建顺序是反的  需要unshift 否则参数顺序会反
            serviceArgs.unshift(service)
        }

        // 真实创建实例
        return new ctor(...[...staticArgs, ...serviceArgs])
    }

    // 通过id获取实例或者描述符
    public getServiceInstanceOrDescriptor<T>(id: ServiceIdentifier<T>): T | SyncDescriptor<T> {
        return this._services.get(id);
    }

    // 如果是描述器就创建一个实例  否则直接返回实例
    private getOrCreateServiceInstance<T>(dependency: Dependency<T>) {
        const thing = this.getServiceInstanceOrDescriptor(dependency.id)

        if (thing instanceof SyncDescriptor) {
            return this.createAndCacheServiceInstance(dependency)
        }

        return thing
    }

    // 通过服务的唯一标识符 实例化被依赖的服务
    // DFS遍历所有的服务并实例化保存到collection上  最后返回服务实例
    private createAndCacheServiceInstance<T>(dependency: Dependency<T>) {


        // 实例或描述符判断  
        const descOrInstance = this._services.get(dependency.id)
        if (checkDescOrInstance(descOrInstance) == "instance") {
            return descOrInstance
        }

        // 构造第一个节点
        const firstNode = this.createStackNode(dependency)

        // DFS遍历service的依赖  实例化子依赖
        // todo 在DFS的时候构建依赖图 这里直接使用数组代替(只实现了部分功能) 来进行实例化
        const stack: StackNode[] = [firstNode]
        const graph: StackNode[] = [firstNode]

        let cycleCount = 0;
        while (stack.length) {
            const item = stack.pop()!;

            // 通过记录while循环次数判断是否有循环依赖
            if (cycleCount++ > 1000) {
                throw new Error("侦测到循环依赖")
            }

            //todo (有可能这里已经是实例了 不是Desc  故无法获取id$dependences)
            if (checkDescOrInstance(item.desc) !== 'desc') break

            // 继续获取子依赖
            const serviceDependencies = item.desc.ctor["id$dependences"] || []

            for (const dependency of serviceDependencies) {
                // 实例化子服务
                const node = this.createStackNode(dependency)
                this.createAndCacheServiceInstance(dependency)

                graph.push(node)
                stack.push(node)
            }
        }

        // 实例化当前service并保存
        const { id, desc } = firstNode
        const serviceInstance = this.createInstance(desc)
        this._services.set(id, serviceInstance)

        return serviceInstance
    }

    // 创建栈节点 用于进行BFS
    private createStackNode<T>(dependency: Dependency<T>): StackNode {
        const id = dependency.id
        const desc = this.getServiceInstanceOrDescriptor(id) as SyncDescriptor<T>
        const name = dependency.name

        return { name, id, desc }
    }

}


export interface IInstantiationService {
    createInstance<T>(descriptor: SyncDescriptor<T>): T
    getServiceInstanceOrDescriptor<T>(id: ServiceIdentifier<T>): T | SyncDescriptor<T>
}

export const IInstantiationService = createDecorator<IInstantiationService>("IInstantiationService")