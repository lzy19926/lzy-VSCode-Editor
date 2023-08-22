/*
 * @Author: Luzy
 * @Date: 2023-08-22 10:31:12
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 17:29:07
 * @Description: workbench的编辑器部分  使用monaco-editor
 */
import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { Part } from './Part'

//! 这里part同时作为EditorService  即提供服务也提供Dom结构
export class EditorPart implements IEditorService, Part {
    private _editor: any
    private _container!: HTMLElement

    constructor() { }

    // 创建编辑器
    create(container: HTMLElement) {

        this._container = container

        this.updateStyle()
        this.loadMonacoStyle()
        this.loadMonaco()
    }

    // 更新容器样式
    updateStyle() {
        this._container.style.height = "500px"
    }

    // 加载monaco-editor
    //todo 这里需要解决路径问题
    loadMonaco() {

        const requireConfig = { paths: { 'vs': '../node_modules/monaco-editor/min/vs' } };
        const require: any = window.require // 解决ts报错
        require.config(requireConfig);

        require(['vs/editor/editor.main'], () => {

            var options = {
                value: '// 在此处输入您的代码',
                language: 'javascript',
                theme: "vs-dark"
            };

            /*@ts-ignore**/ // 创建编辑器实例，并将其挂载到指定 dom 元素上 
            this._editor = window.monaco.editor.create(this._container, options);
        })

    }

    // 加载monaco-editor样式文件
    loadMonacoStyle() {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = "../node_modules/monaco-editor/min/vs/editor/editor.main.css";
        document.getElementsByTagName('head')[0].appendChild(link);
    }
}

export interface IEditorService {

}

export const IEditorService = createDecorator<IEditorService>("IEditorService")
registerSingleton(IEditorService, EditorPart)
