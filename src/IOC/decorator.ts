/*
 * @Author: Luzy
 * @Date: 2023-08-20 15:28:52
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-20 15:37:15
 * @Description: 通过接口创建一个装饰器, 用于给构造函数添加需要的服务ID
 */


// 单个依赖对象
export type Dependency<T> = {
    name: string
    id: ServiceIdentifier<T>
    index: number
}


// 服务标识符类型
export interface ServiceIdentifier<T> {
    (...args: any[]): void;
    type: T;
}

// 声明全局命名空间来保存Services标识符
namespace _cache {
    export const serviceIds = new Map<string, ServiceIdentifier<any>>();
}

// 创建装饰器方法
export function createDecorator<T>(serviceId: string): ServiceIdentifier<T> {
    if (_cache.serviceIds.has(serviceId)) {
        return _cache.serviceIds.get(serviceId)!;
    }

    // 创建装饰器   装饰器函数编译后会执行 
    // target即是被装饰的目标 <any>用来定义函数类型 index为参数序号
    const id = <any>function (target: Function, key: string, index: number): any {
        // 在Target的id$dependences属性上保存所需依赖的id
        const idDependences: Dependency<any>[] = (target as any)["id$dependences"]
        const name = serviceId

        if (!idDependences) {
            (target as any)["id$dependences"] = [{ name, id, index }]
        } else {
            (target as any)["id$dependences"].push({ name, id, index })
        }

    }

    //!注意这里 将装饰器函数作为Service的唯一标识符id  防止命名冲突问题
    _cache.serviceIds.set(serviceId, id);
    
    // 修改id函数的toString方法 以便将serviceId与其对应
    id.toString = () => serviceId;

    return id
}