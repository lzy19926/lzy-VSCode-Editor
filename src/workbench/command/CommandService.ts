/*
 * @Author: Luzy
 * @Date: 2023-09-07 19:45:45
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-07 19:50:44
 * @Description: CommandService用于执行动作需要使用的服务,单独抽离
 * 将动作从IOC容器中抽离出来  
 */
import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { CommandsRegistry } from './CommandsRegistry'

class CommandService implements ICommandService {

    public executeCommand(id: string, ...args: any[]): Promise<any> {
        const command = CommandsRegistry.getCommand(id);

        if (!command) {
            return Promise.reject(new Error(`command '${id}' not found`));
        }

        try {
            const result = command(...args)
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err);
        }
    }
}


export interface ICommandService {
    executeCommand(id: string, ...args: any[]): Promise<any>
}

export const ICommandService = createDecorator<ICommandService>("ICommandService")
registerSingleton(ICommandService, CommandService)