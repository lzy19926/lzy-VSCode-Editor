/*
 * @Author: Luzy
 * @Date: 2023-09-07 19:41:39
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-07 19:41:43
 * @Description: 全局Command注册器单例
 */

export const CommandsRegistry = new class {
    private readonly _commands = new Map<string, Function>();


    registerCommand({ id, handler }: { id: string, handler: Function }) {
        this._commands.set(id, handler)
    }

    getCommand(id: string): Function | undefined {
        return this._commands.get(id);
    }
}