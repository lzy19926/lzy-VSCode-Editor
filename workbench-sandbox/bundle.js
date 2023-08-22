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
 * @LastEditTime: 2023-08-22 17:55:23
 * @Description: 运行于浏览器端的编辑器主模块
 */
const EditorPart_1 = __webpack_require__(1);
const SideBar_1 = __webpack_require__(4);
const TitleBar_1 = __webpack_require__(5);
const serviceCollection_1 = __webpack_require__(3);
const InstantiationService_1 = __webpack_require__(6);
var Parts;
(function (Parts) {
    Parts["TITLEBAR_PART"] = "workbench.parts.titlebar";
    Parts["SIDEBAR_PART"] = "workbench.parts.sidebar";
    Parts["EDITOR_PART"] = "workbench.parts.editor";
})(Parts || (exports.Parts = Parts = {}));
let Workbench = exports.Workbench = class Workbench {
    parts = new Map();
    constructor(titleBarService, editorService, sideBarService) {
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
    __param(0, TitleBar_1.ITitleBarService),
    __param(1, EditorPart_1.IEditorService),
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
 * @LastEditTime: 2023-08-22 18:35:44
 * @Description: workbench的编辑器部分  使用monaco-editor
 */
const decorator_1 = __webpack_require__(2);
const serviceCollection_1 = __webpack_require__(3);
//! 这里part同时作为EditorService  即提供服务也提供Dom结构
class EditorPart {
    _editor;
    _container;
    constructor() { }
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
    // 创建编辑器
    create(container) {
        this._container = container;
        this.updateStyle();
        this.loadMonacoStyle();
        this.loadMonaco();
    }
    // 编辑器加载文件
    loadFileContent(text) {
        this._editor.getModel().setValue(text);
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
 * @LastEditTime: 2023-08-22 11:39:30
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


/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 18:35:32
 * @Description: 左侧文件资源管理器view模块
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
exports.ISideBarService = exports.SideBarPart = void 0;
const decorator_1 = __webpack_require__(2);
const serviceCollection_1 = __webpack_require__(3);
const EditorPart_1 = __webpack_require__(1);
let SideBarPart = exports.SideBarPart = class SideBarPart {
    editorService;
    _container;
    constructor(editorService) {
        this.editorService = editorService;
    }
    create(container) {
        this._container = container;
        this.createButton();
    }
    createButton() {
        const btn = document.createElement("input");
        btn.innerText = "打开文件测试";
        btn.type = "file";
        btn.onchange = this.readFileTest.bind(this);
        this._container.appendChild(btn);
    }
    // 加载文件测试
    readFileTest(event) {
        /**@ts-ignore*/
        const file = event.target?.files?.[0];
        const editor = this.editorService;
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const text = reader.result;
                if (typeof text == 'string') {
                    editor.loadFileContent(text);
                }
            };
            reader.readAsText(file);
        }
    }
};
exports.SideBarPart = SideBarPart = __decorate([
    __param(0, EditorPart_1.IEditorService)
], SideBarPart);
exports.ISideBarService = (0, decorator_1.createDecorator)("ISideBarService");
(0, serviceCollection_1.registerSingleton)(exports.ISideBarService, SideBarPart);


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 12:57:17
 * @Description:
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ITitleBarService = exports.TitleBarPart = void 0;
const decorator_1 = __webpack_require__(2);
const serviceCollection_1 = __webpack_require__(3);
class TitleBarPart {
    create(container) {
    }
}
exports.TitleBarPart = TitleBarPart;
exports.ITitleBarService = (0, decorator_1.createDecorator)("ITitleBarService");
(0, serviceCollection_1.registerSingleton)(exports.ITitleBarService, TitleBarPart);


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * @Author: Luzy
 * @Date: 2023-08-20 15:32:08
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 11:12:58
 * @Description: 提供注入依赖逻辑并实例化的服务,使用该服务实例化其他服务
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IInstantiationService = exports.InstantiationService = void 0;
const serviceCollection_1 = __webpack_require__(3);
const decorator_1 = __webpack_require__(2);
// 实例化服务, 用于将单个服务进行实例化,并提供注入依赖逻辑
class InstantiationService {
    _services;
    constructor(_services) {
        this._services = _services;
    }
    createInstance(descriptor) {
        const ctor = descriptor.ctor; // 构造函数
        const staticArgs = descriptor.staticArguments; // 静态参数
        const serviceArgs = []; // 注入的Services
        // 将装饰器注入的服务取出并进行实例化
        // 装饰器保存依赖描述符到数组中
        const serviceDependencies = ctor["id$dependences"] || [];
        for (const dependency of serviceDependencies) {
            const service = this.getOrCreateServiceInstance(dependency);
            serviceArgs.push(service);
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
            // 继续获取子依赖
            const serviceDependencies = item.desc.ctor["id$dependences"] || [];
            for (const dependency of serviceDependencies) {
                const node = this.createStackNode(dependency);
                // 实例化子服务
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