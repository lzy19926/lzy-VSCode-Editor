/*
 * @Author: Luzy
 * @Date: 2023-08-20 15:32:56
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 13:05:53
 * @Description: 
 */
import { createDecorator } from './decorator'
import { InstantiationService } from './InstantiationService'
import { ServiceCollection, SyncDescriptor, registerSingleton } from './serviceCollection'




// 创建服务集  内部保存了多个服务  [id(Decorator),descriptor]
const services = new ServiceCollection()

// 定义一组接口和具体实现 
// 创建为装饰器并注册
interface IBar { }
class Bar implements IBar { }
const IBar = createDecorator<IBar>('IBar');
registerSingleton(IBar, Bar)


interface ITab { }
class Tab implements ITab { }
const ITab = createDecorator<ITab>('ITab');
registerSingleton(ITab, Tab)


interface IEditor { }
class Editor implements IEditor {
    constructor(
        @IBar bar: IBar,
        @ITab tab: ITab
    ) { }
}
const IEditor = createDecorator<IEditor>('IEditor');
registerSingleton(IEditor, Editor)



// 需要实例化的服务
class App {
    constructor(
        @IEditor editor: IEditor
    ) { }
}

// 用于实例化服务并注入依赖
const instantiationService = new InstantiationService(services)

// 根APP根据描述符进行构建
const appDescriptor = new SyncDescriptor(App)

// 通过根App描述符实例化整个App
const app = instantiationService.createInstance(appDescriptor)