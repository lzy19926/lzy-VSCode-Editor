
/*
 * @Author: Luzy
 * @Date: 2023-08-22 10:31:12
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-07 19:21:21
 * @Description: workbench的编辑器部分  使用monaco-editor
 */
import { Part } from './Part'
import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import type { TextFileModel } from '../services/TextFileService'
import type { editor as monaco } from 'monaco-editor'

type MonacoEditor = monaco.ICodeEditor

export class EditorPart implements IEditorPart, Part {
    private _editor!: MonacoEditor
    private _container!: HTMLElement
    private _currentModel?: TextFileModel

    constructor() { }

    // 创建编辑器
    public create(container: HTMLElement) {
        this._container = container
        this.updateStyle()
        this.loadMonacoStyle()
        this.loadMonaco()
        this.reloadEditor()
    }

    // 更新容器样式
    private updateStyle() {
        this._container.style.height = "95%"
    }

    // 加载monaco-editor  //todo 这里需要解决路径问题
    private loadMonaco() {
        const requireConfig = { paths: { 'vs': '../node_modules/monaco-editor/min/vs' } };
        const require: any = window.require // 解决ts报错
        require.config(requireConfig);

        require(['vs/editor/editor.main'], () => {
            var options = {
                value: '// 在此处输入您的代码',
                language: 'typescript',
                theme: "vs-dark"
            };

            /*@ts-ignore**/ // 创建编辑器实例，并将其挂载到指定 dom 元素上 
            this._editor = window.monaco.editor.create(this._container, options);
        })
    }

    // 加载monaco-editor样式文件
    private loadMonacoStyle() {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = "../node_modules/monaco-editor/min/vs/editor/editor.main.css";
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    // 编辑器响应式布局重绘功能 监听resize事件实现
    private reloadEditor() {
        window.addEventListener('resize', () => {
            const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - this._container.offsetTop;

            this._container.style.height = `${height}px`;

            if (this._editor) {
                this._editor.layout();
            }
        });

    }

    // 编辑器加载文件
    public loadFileModel(model: TextFileModel) {
        this._editor.getModel()!.setValue(model.text)
        this._currentModel = model
        console.log("loadFile model", this._currentModel);
    }

    // 获取当前文件对象
    public getCurrentModel(): TextFileModel | undefined {
        return this._currentModel
    }

    // 获取当前文本
    public getCurrentText(): string {
        return this._editor.getModel()!.getValue()
    }

    // 清空内容
    public clearContent() {
        this._editor.getModel()!.setValue("//请打开文件")
    }
}

export interface IEditorPart {
    create(container: HTMLElement): void
    loadFileModel(model: TextFileModel): void
    clearContent(): void
    getCurrentModel(): TextFileModel | undefined
    getCurrentText(): string
}

export const IEditorPart = createDecorator<IEditorPart>("IEditorPart")
registerSingleton(IEditorPart, EditorPart)
