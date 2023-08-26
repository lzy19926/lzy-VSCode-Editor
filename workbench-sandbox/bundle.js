define(() => { return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Workbench = exports.Parts = void 0;
/*
 * @Author: Luzy
 * @Date: 2023-08-21 18:09:25
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 18:59:48
 * @Description: 运行于浏览器端的编辑器主模块
 */
const Editor_1 = __webpack_require__(1);
const SideBar_1 = __webpack_require__(4);
const TitleBar_1 = __webpack_require__(9);
const serviceCollection_1 = __webpack_require__(3);
const InstantiationService_1 = __webpack_require__(10);
var Parts;
(function (Parts) {
    Parts["TITLEBAR_PART"] = "workbench.parts.titlebar";
    Parts["SIDEBAR_PART"] = "workbench.parts.sidebar";
    Parts["EDITOR_PART"] = "workbench.parts.editor";
})(Parts || (exports.Parts = Parts = {}));
let Workbench = exports.Workbench = class Workbench {
    parts = new Map();
    constructor(editorService, titleBarService, sideBarService) {
        this.parts.set(Parts.EDITOR_PART, editorService);
        this.parts.set(Parts.SIDEBAR_PART, sideBarService);
        this.parts.set(Parts.TITLEBAR_PART, titleBarService);
    }
    open() {
        this.createParts();
    }
    createParts() {
        const needParts = [
            { id: Parts.EDITOR_PART, classList: ["editor"] },
            { id: Parts.SIDEBAR_PART, classList: ["sideBar"] },
            { id: Parts.TITLEBAR_PART, classList: ["titleBar"] },
        ];
        for (const { id, classList } of needParts) {
            const partContainer = this.createPartContainer(id, classList);
            this.parts.get(id).create(partContainer);
        }
    }
    createPartContainer(id, classList) {
        const container = document.createElement('div');
        container.id = id;
        container.classList.add(...classList);
        document.body.appendChild(container);
        return container;
    }
};
exports.Workbench = Workbench = __decorate([
    __param(0, Editor_1.IEditorService),
    __param(1, TitleBar_1.ITitleBarService),
    __param(2, SideBar_1.ISideBarService)
], Workbench);
// 创建运行workbench
function main() {
    const services = (0, serviceCollection_1.getGlobalCollection)();
    const WorkbenchDesc = new serviceCollection_1.SyncDescriptor(Workbench);
    const instantiationService = new InstantiationService_1.InstantiationService(services);
    const workbench = instantiationService.createInstance(WorkbenchDesc);
    workbench.open();
}
main();


/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IEditorService = exports.EditorPart = void 0;
/*
 * @Author: Luzy
 * @Date: 2023-08-22 10:31:12
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-26 18:41:27
 * @Description: workbench的编辑器部分  使用monaco-editor
 */
const decorator_1 = __webpack_require__(2);
const serviceCollection_1 = __webpack_require__(3);
class EditorPart {
    _editor;
    _container;
    _currentModel;
    constructor() { }
    // 创建编辑器
    create(container) {
        this._container = container;
        this.updateStyle();
        this.loadMonacoStyle();
        this.loadMonaco();
        this.reloadEditor();
    }
    // 更新容器样式
    updateStyle() {
        this._container.style.height = "95%";
    }
    // 加载monaco-editor
    //todo 这里需要解决路径问题
    loadMonaco() {
        const requireConfig = { paths: { 'vs': '../node_modules/monaco-editor/min/vs' } };
        const require = window.require; // 解决ts报错
        require.config(requireConfig);
        require(['vs/editor/editor.main'], () => {
            var options = {
                value: '// 在此处输入您的代码',
                language: 'typescript',
                theme: "vs-dark"
            };
            /*@ts-ignore**/ // 创建编辑器实例，并将其挂载到指定 dom 元素上 
            this._editor = window.monaco.editor.create(this._container, options);
        });
    }
    // 加载monaco-editor样式文件
    loadMonacoStyle() {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = "../node_modules/monaco-editor/min/vs/editor/editor.main.css";
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    // 编辑器响应式布局重绘功能
    reloadEditor() {
        // 监听 Window 的 resize事件以触发菜单栏重绘、同时更新 Monaco Editor 的宽度与高度
        window.addEventListener('resize', () => {
            const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - this._container.offsetTop;
            this._container.style.height = `${height}px`;
            if (this._editor) {
                this._editor.layout();
            }
        });
    }
    // 编辑器加载文件
    loadFileModel(model) {
        this._editor.getModel().setValue(model.text);
        this._currentModel = model;
        console.log("loadFile model", this._currentModel);
    }
    // 获取当前文件对象
    getCurrentModel() {
        return this._currentModel;
    }
    // 获取当前文本
    getCurrentText() {
        return this._editor.getModel().getValue();
    }
}
exports.EditorPart = EditorPart;
exports.IEditorService = (0, decorator_1.createDecorator)("IEditorService");
(0, serviceCollection_1.registerSingleton)(exports.IEditorService, EditorPart);


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports) => {


/*
 * @Author: Luzy
 * @Date: 2023-08-20 15:28:52
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-20 15:37:15
 * @Description: 通过接口创建一个装饰器, 用于给构造函数添加需要的服务ID
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createDecorator = void 0;
// 声明全局命名空间来保存Services标识符
var _cache;
(function (_cache) {
    _cache.serviceIds = new Map();
})(_cache || (_cache = {}));
// 创建装饰器方法
function createDecorator(serviceId) {
    if (_cache.serviceIds.has(serviceId)) {
        return _cache.serviceIds.get(serviceId);
    }
    // 创建装饰器   装饰器函数编译后会执行 
    // target即是被装饰的目标 <any>用来定义函数类型 index为参数序号
    const id = function (target, key, index) {
        // 在Target的id$dependences属性上保存所需依赖的id
        const idDependences = target["id$dependences"];
        const name = serviceId;
        if (!idDependences) {
            target["id$dependences"] = [{ name, id, index }];
        }
        else {
            target["id$dependences"].push({ name, id, index });
        }
    };
    //!注意这里 将装饰器函数作为Service的唯一标识符id  防止命名冲突问题
    _cache.serviceIds.set(serviceId, id);
    // 修改id函数的toString方法 以便将serviceId与其对应
    id.toString = () => serviceId;
    return id;
}
exports.createDecorator = createDecorator;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports) => {


/*
 * @Author: Luzy
 * @Date: 2023-08-18 15:24:37
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-26 01:06:48
 * @Description: 用于保存Service实例或描述器的集合
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getGlobalCollection = exports.registerSingleton = exports.SyncDescriptor = exports.ServiceCollection = void 0;
class ServiceCollection {
    _entries = new Map();
    constructor(...entries) {
        for (const [id, service] of entries) {
            this.set(id, service);
        }
    }
    has(id) {
        return this._entries.has(id);
    }
    set(id, descOrInstance) {
        this._entries.set(id, descOrInstance);
    }
    get(id) {
        return this._entries.get(id);
    }
}
exports.ServiceCollection = ServiceCollection;
// 类描述器  保存了构造函数和参数  用于实例化
class SyncDescriptor {
    ctor; // 服务的构造器
    staticArguments; // 静态参数
    constructor(ctor, staticArguments = []) {
        this.ctor = ctor;
        this.staticArguments = staticArguments;
    }
}
exports.SyncDescriptor = SyncDescriptor;
// 
const globalServiceCollection = new ServiceCollection();
// 注册为单例  传入id和构造函数 创建描述器 后续会使用描述器进行实例化
function registerSingleton(id, ctor) {
    const descriptor = new SyncDescriptor(ctor, []);
    globalServiceCollection.set(id, descriptor);
}
exports.registerSingleton = registerSingleton;
function getGlobalCollection() {
    return globalServiceCollection;
}
exports.getGlobalCollection = getGlobalCollection;


/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ISideBarService = exports.SideBarPart = void 0;
/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-26 18:42:46
 * @Description: 左侧文件资源管理器view模块
 */
const decorator_1 = __webpack_require__(2);
const serviceCollection_1 = __webpack_require__(3);
const textFileService_1 = __webpack_require__(5);
const Editor_1 = __webpack_require__(1);
const IPCRendererService_1 = __webpack_require__(7);
const treeView_1 = __webpack_require__(8);
let SideBarPart = exports.SideBarPart = class SideBarPart {
    editorService;
    textFileService;
    ipcRendererService;
    _container;
    constructor(editorService, textFileService, ipcRendererService) {
        this.editorService = editorService;
        this.textFileService = textFileService;
        this.ipcRendererService = ipcRendererService;
    }
    create(container) {
        this._container = container;
    }
    // 渲染文件列表 给列表节点指定事件
    renderFileList(fileTree) {
        let tree = new treeView_1.TreeListView([fileTree]);
        tree.bindEvents([
            { eventName: "click", callback: this.event_loadFileContent.bind(this) }
        ]);
        tree.render(this._container);
    }
    //ul事件 渲染单个文件
    async event_loadFileContent(e, node) {
        console.log("--fileInfo--", node);
        const isDir = node.origin?.isDir;
        if (isDir)
            return;
        // todo 使用缓存
        const fileAbsolutePath = node.origin?.absolutePath;
        const fileText = await this.ipcRendererService.invokeAPI("readFileTextSync", { path: fileAbsolutePath });
        const model = this.textFileService.getFileModel(fileAbsolutePath, fileText);
        // 渲染文件Model
        this.editorService.loadFileModel(model);
    }
};
exports.SideBarPart = SideBarPart = __decorate([
    __param(0, Editor_1.IEditorService),
    __param(1, textFileService_1.ITextFileService),
    __param(2, IPCRendererService_1.IIPCRendererService)
], SideBarPart);
exports.ISideBarService = (0, decorator_1.createDecorator)("ISideBarService");
(0, serviceCollection_1.registerSingleton)(exports.ISideBarService, SideBarPart);


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*
 * @Author: Luzy
 * @Date: 2023-08-25 16:42:55
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-26 18:32:14
 * @Description: 提供前端文本模型相关功能, 前端文本先修改后再修改后端文本
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ITextFileService = exports.TextFileService = void 0;
const decorator_1 = __webpack_require__(2);
const serviceCollection_1 = __webpack_require__(3);
const cacheFileService_1 = __webpack_require__(6);
const Editor_1 = __webpack_require__(1);
const IPCRendererService_1 = __webpack_require__(7);
let TextFileService = exports.TextFileService = class TextFileService {
    cacheFileService;
    editorService;
    ipcRendererService;
    _currentModel; //当前编辑器中的文件模型
    constructor(cacheFileService, editorService, ipcRendererService) {
        this.cacheFileService = cacheFileService;
        this.editorService = editorService;
        this.ipcRendererService = ipcRendererService;
        this.onSaveFile();
    }
    // 比较编辑器文本和原文件内容
    // todo 需要优化为使用ArrayBuffer进行逐行比较  否则字符串过大会崩溃
    // todo 可使用下列库进行操作
    // JsDiff：一个用于Web浏览器和Node.js 的JavaScript差异算法。它支持字符、标记以及行对比。
    // fast-jsdiff：JsDiff改进，并加入了Babylon diff补丁支持。
    diffText_test() {
        const currentText = this.editorService.getCurrentText();
        const originModel = this.editorService.getCurrentModel();
        if (originModel) {
            const id = originModel.id;
            if (originModel.text !== currentText) {
                console.log(`File:[[${id}]]  Changed`);
                this.updateDiskFile(id, currentText);
                this.cacheFileService.update(id, currentText);
            }
            else {
                console.log(`File:[[${id}]]  NO Changed`);
            }
        }
    }
    // 获取文件模型
    getFileModel(path, bufferOrText) {
        let model = this.cacheFileService.get(path);
        if (!model) {
            model = this._createFileModel(path, bufferOrText);
            this.cacheFileService.set(path, model);
        }
        return model;
    }
    // 创建文件模型(创建文件的Uint8Array和text)
    _createFileModel(id, bufferOrText) {
        let text, buffer;
        if (typeof bufferOrText == 'string') {
            text = bufferOrText;
        }
        else {
            buffer = new Uint8Array(bufferOrText);
            text = new TextDecoder().decode(buffer);
        }
        return { id, text, buffer };
    }
    // 通知文件进程写回文件内容到硬盘
    updateDiskFile(path, content) {
        this.ipcRendererService.invokeAPI("writeFileTextSync", { path, text: content });
        console.log(`Update File:[[${path}]] in Disk Succeed`);
    }
    //!-------------------监听ctrl+s键盘事件--------------------
    //todo 使用mousetrap库进行改写
    onSaveFile() {
        const that = this;
        document.addEventListener('keydown', function (event) {
            // 按下 Ctrl 和 s 键
            if (event.ctrlKey && event.keyCode === 83) {
                // 防止浏览器默认行为 
                event.preventDefault();
                console.log('Ctrl+S was pressed');
                that.diffText_test();
            }
        });
    }
};
exports.TextFileService = TextFileService = __decorate([
    __param(0, cacheFileService_1.ICacheFileService),
    __param(1, Editor_1.IEditorService),
    __param(2, IPCRendererService_1.IIPCRendererService)
], TextFileService);
exports.ITextFileService = (0, decorator_1.createDecorator)("ITextFileService");
(0, serviceCollection_1.registerSingleton)(exports.ITextFileService, TextFileService);


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * @Author: Luzy
 * @Date: 2023-08-25 16:56:06
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-25 18:51:48
 * @Description: 提供文本文件前端缓存功能
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ICacheFileService = exports.CacheFileService = void 0;
const decorator_1 = __webpack_require__(2);
const serviceCollection_1 = __webpack_require__(3);
class CacheFileService {
    _cache = new Map();
    get(id) {
        return this._cache.get(id);
    }
    set(id, model) {
        this._cache.set(id, model);
    }
    update(id, text) {
        const model = this._cache.get(id);
        if (model) {
            model.text = text;
            console.log(`Update File:[[${id}]] in Cache Succeed`);
        }
    }
}
exports.CacheFileService = CacheFileService;
exports.ICacheFileService = (0, decorator_1.createDecorator)("ICacheFileService");
(0, serviceCollection_1.registerSingleton)(exports.ICacheFileService, CacheFileService);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IIPCRendererService = exports.IPCRendererService = void 0;
/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-26 17:44:53
 * @Description: 运行在渲染进程中的IPC通信模块 负责与主进程通信
 */
const decorator_1 = __webpack_require__(2);
const serviceCollection_1 = __webpack_require__(3);
class IPCRendererService {
    IPC;
    constructor() {
        this.IPC = window.IPC;
    }
    // 此API类似于网络请求的fetch
    // https://www.electronjs.org/zh/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    invokeAPI(api, params) {
        return this.IPC.invoke("API", { api, params });
    }
}
exports.IPCRendererService = IPCRendererService;
exports.IIPCRendererService = (0, decorator_1.createDecorator)("IIPCRendererService");
(0, serviceCollection_1.registerSingleton)(exports.IIPCRendererService, IPCRendererService);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports) => {


/*
 * @Author: Luzy
 * @Date: 2023-08-24 12:04:24
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-25 14:28:02
 * @Description: 树状列表组件 用于文件展示等功能
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreeListView = void 0;
// 根据树结构创建节点对象
function createNodeTree(data) {
    const root = new TreeNode('root', data);
    data.forEach((item) => {
        let node = new TreeNode(item.name, item);
        if (item.children && item.children.length > 0) {
            const childrenNodes = createNodeTree(item.children);
            childrenNodes.children.forEach(child => node.addChild(child));
        }
        root.addChild(node);
    });
    return root;
}
// 节点类
class TreeNode {
    id;
    name;
    children;
    expanded;
    origin;
    constructor(name, originData) {
        this.id = name;
        this.name = name;
        this.children = [];
        this.expanded = false; // 是否展开节点
        this.origin = originData; // 构建该节点的原本数据
    }
    addChild(node) {
        this.children.push(node);
    }
}
// 列表组件类
class TreeListView {
    data;
    rootNode;
    listBody;
    constructor(data) {
        this.data = data;
        this.listBody = this.initListBody();
        this.rootNode = createNodeTree(this.data);
    }
    // 创建list-ul主Dom
    initListBody() {
        return document.createElement("ul");
    }
    // 收起或者展开树形列表项。如果点击区域在子列表上则不切换收起状态。
    toggleExpandStatus(event) {
        const { currentNode, nodeElement } = this.getTriggerEventNode(event);
        if (!currentNode)
            return;
        currentNode.expanded = !currentNode.expanded;
        const node__children = nodeElement.querySelector(".node__children");
        const expand_icon = nodeElement.querySelector(".expand_icon");
        if (currentNode.expanded == true) {
            node__children.classList.remove("hidden");
            if (expand_icon.innerText.length > 0) {
                expand_icon.innerText = "-";
            }
        }
        else {
            node__children.classList.add("hidden");
            if (expand_icon.innerText.length > 0) {
                expand_icon.innerText = "+";
            }
        }
    }
    // 递归地获取树形结构的 HTML Text
    getHtmlFromTreeNode(treeRootNode, floor) {
        const result = [];
        treeRootNode.children.forEach(childNode => {
            let icon = childNode.children.length > 0 ? '+' : '';
            let childrenHtml = this.getHtmlFromTreeNode(childNode, floor + 1);
            let spaces = Array(floor).fill('&nbsp&nbsp&nbsp').join('');
            let node = `
                    <div class="node ${icon ? 'has-children' : ''}" data-node-id="${childNode.id}">
                        <span>${spaces}</span>
                        <span class="expand_icon">${icon}</span>
                        <span class="node__name">${childNode.name}</span>
                    	<div class ="node__children hidden">
                        	${childrenHtml}
                       </div>
                  </div>`;
            result.push(node);
        });
        return result.join('');
    }
    // 渲染整个树状列表结构到指定选择器中。
    render(container) {
        const html = this.getHtmlFromTreeNode(this.rootNode, 0);
        this.listBody.innerHTML = html;
        container.appendChild(this.listBody);
    }
    // 给列表节点绑定外部传入的事件(将事件代理到最顶层节点)
    bindEvents(nodeEvents = []) {
        if (!this.listBody)
            return console.error("listbody ul did not created");
        this.listBody.addEventListener("click", this.toggleExpandStatus.bind(this));
        nodeEvents.forEach(({ eventName, callback }) => {
            // 给传入的事件注入所需参数(触发的节点)
            const wrappedEvent = (event) => {
                const { currentNode, nodeElement } = this.getTriggerEventNode(event);
                callback(event, currentNode);
            };
            this.listBody.addEventListener(eventName, wrappedEvent);
        });
    }
    // 根据点击事件查找当前节点
    getTriggerEventNode(event) {
        const el = event.target;
        if (!el.classList.contains("node__name"))
            return {};
        const nodeElement = el.closest(".node");
        const nodeId = nodeElement.dataset.nodeId;
        const currentNode = this.getNodeById(nodeId, this.rootNode);
        return { currentNode, nodeElement };
    }
    // 根据 id 查找节点，如果未找到返回 null - DFS 
    getNodeById(id, treeRoot = this.rootNode) {
        if (treeRoot.id === id)
            return treeRoot;
        for (let i = 0; i < treeRoot.children.length; i++) {
            const match = this.getNodeById(id, treeRoot.children[i]);
            if (match !== null)
                return match;
        }
        return null;
    }
}
exports.TreeListView = TreeListView;


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ITitleBarService = exports.TitleBarPart = void 0;
/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-26 17:49:22
 * @Description: 顶部导航菜单栏
 */
const decorator_1 = __webpack_require__(2);
const serviceCollection_1 = __webpack_require__(3);
const Editor_1 = __webpack_require__(1);
const SideBar_1 = __webpack_require__(4);
const IPCRendererService_1 = __webpack_require__(7);
let TitleBarPart = exports.TitleBarPart = class TitleBarPart {
    editorService;
    sideBarService;
    ipcRendererService;
    _container;
    constructor(editorService, sideBarService, ipcRendererService) {
        this.editorService = editorService;
        this.sideBarService = sideBarService;
        this.ipcRendererService = ipcRendererService;
    }
    create(container) {
        this._container = container;
        this.createOpenDirBtn();
        this.createOpenFileBtn();
    }
    // 打开文件夹按钮
    createOpenDirBtn() {
        const btn = document.createElement("button");
        btn.innerText = "打开文件夹";
        btn.onclick = this.event_loadFiletreeFromDir.bind(this);
        this._container.appendChild(btn);
    }
    // 打开文件按钮
    createOpenFileBtn() {
        const btn = document.createElement("button");
        btn.innerText = "打开文件";
        btn.onclick = this.event_loadFileContent.bind(this);
        this._container.appendChild(btn);
    }
    // 按钮事件 获取并加载文件树
    async event_loadFiletreeFromDir(event) {
        const res = await this.ipcRendererService.invokeAPI("getFileTreeFromDir");
        const fileTree = res;
        this.sideBarService.renderFileList(fileTree);
    }
    //todo 需要重写 按钮事件 加载单个文件
    async event_loadFileContent(event) {
        alert("此功能暂不开放");
    }
};
exports.TitleBarPart = TitleBarPart = __decorate([
    __param(0, Editor_1.IEditorService),
    __param(1, SideBar_1.ISideBarService),
    __param(2, IPCRendererService_1.IIPCRendererService)
], TitleBarPart);
exports.ITitleBarService = (0, decorator_1.createDecorator)("ITitleBarService");
(0, serviceCollection_1.registerSingleton)(exports.ITitleBarService, TitleBarPart);


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * @Author: Luzy
 * @Date: 2023-08-20 15:32:08
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-26 01:00:39
 * @Description: 提供注入依赖逻辑并实例化的服务,使用该服务实例化其他服务
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IInstantiationService = exports.InstantiationService = void 0;
const serviceCollection_1 = __webpack_require__(3);
const decorator_1 = __webpack_require__(2);
// 检查是实例还是描述符
function checkDescOrInstance(descOrInstance) {
    const isDesc = (descOrInstance instanceof serviceCollection_1.SyncDescriptor);
    if (isDesc) {
        return "desc";
    }
    else if (typeof descOrInstance !== 'undefined' && !isDesc) {
        return "instance";
    }
    else {
        return "unknow";
    }
}
// 实例化服务, 用于将单个服务进行实例化,并提供注入依赖逻辑
class InstantiationService {
    _services;
    constructor(_services) {
        this._services = _services;
    }
    // 创建实例
    createInstance(descOrInstance) {
        if (checkDescOrInstance(descOrInstance) == 'instance') {
            return descOrInstance;
        }
        else {
            return this._createInstance(descOrInstance);
        }
    }
    _createInstance(descriptor) {
        const ctor = descriptor.ctor; // 构造函数
        const staticArgs = descriptor.staticArguments; // 静态参数
        const serviceArgs = []; // 注入的Services
        // 将装饰器注入的服务取出并进行实例化
        // 装饰器保存依赖描述符到数组中
        const serviceDependencies = ctor["id$dependences"] || [];
        for (const dependency of serviceDependencies) {
            const service = this.getOrCreateServiceInstance(dependency);
            // 注意这里的构建顺序是反的  需要unshift 否则参数顺序会反
            serviceArgs.unshift(service);
        }
        // 真实创建实例
        return new ctor(...[...staticArgs, ...serviceArgs]);
    }
    // 通过id获取实例或者描述符
    getServiceInstanceOrDescriptor(id) {
        return this._services.get(id);
    }
    // 如果是描述器就创建一个实例  否则直接返回实例
    getOrCreateServiceInstance(dependency) {
        const thing = this.getServiceInstanceOrDescriptor(dependency.id);
        if (thing instanceof serviceCollection_1.SyncDescriptor) {
            return this.createAndCacheServiceInstance(dependency);
        }
        return thing;
    }
    // 通过服务的唯一标识符 实例化被依赖的服务
    // DFS遍历所有的服务并实例化保存到collection上  最后返回服务实例
    createAndCacheServiceInstance(dependency) {
        // 实例或描述符判断  
        const descOrInstance = this._services.get(dependency.id);
        if (checkDescOrInstance(descOrInstance) == "instance") {
            return descOrInstance;
        }
        // 构造第一个节点
        const firstNode = this.createStackNode(dependency);
        // DFS遍历service的依赖  实例化子依赖
        // todo 在DFS的时候构建依赖图 这里直接使用数组代替(只实现了部分功能) 来进行实例化
        const stack = [firstNode];
        const graph = [firstNode];
        let cycleCount = 0;
        while (stack.length) {
            const item = stack.pop();
            // 通过记录while循环次数判断是否有循环依赖
            if (cycleCount++ > 1000) {
                throw new Error("侦测到循环依赖");
            }
            //todo (有可能这里已经是实例了 不是Desc  故无法获取id$dependences)
            if (checkDescOrInstance(item.desc) !== 'desc')
                break;
            // 继续获取子依赖
            const serviceDependencies = item.desc.ctor["id$dependences"] || [];
            for (const dependency of serviceDependencies) {
                // 实例化子服务
                const node = this.createStackNode(dependency);
                this.createAndCacheServiceInstance(dependency);
                graph.push(node);
                stack.push(node);
            }
        }
        // 实例化当前service并保存
        const { id, desc } = firstNode;
        const serviceInstance = this.createInstance(desc);
        this._services.set(id, serviceInstance);
        return serviceInstance;
    }
    // 创建栈节点 用于进行BFS
    createStackNode(dependency) {
        const id = dependency.id;
        const desc = this.getServiceInstanceOrDescriptor(id);
        const name = dependency.name;
        return { name, id, desc };
    }
}
exports.InstantiationService = InstantiationService;
exports.IInstantiationService = (0, decorator_1.createDecorator)("IInstantiationService");


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});;