/*
 * @Author: Luzy
 * @Date: 2023-08-24 12:04:24
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-25 14:28:02
 * @Description: 树状列表组件 用于文件展示等功能
 */


// 根据树结构创建节点对象
function createNodeTree(data: any): TreeNode {
    const root = new TreeNode('root', data);

    data.forEach((item: any) => {
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

    id: string
    name: string
    children: TreeNode[]
    expanded: boolean
    origin: any

    constructor(name: string, originData: any) {
        this.id = name
        this.name = name;
        this.children = [];
        this.expanded = false; // 是否展开节点
        this.origin = originData // 构建该节点的原本数据
    }

    addChild(node: TreeNode) {
        this.children.push(node);
    }
}

// 列表组件类
export class TreeListView {
    readonly data: any
    readonly rootNode: TreeNode
    listBody!: HTMLElement

    constructor(data: any) {
        this.data = data;
        this.listBody = this.initListBody()
        this.rootNode = createNodeTree(this.data);
    }

    // 创建list-ul主Dom
    initListBody(): HTMLUListElement {
        return document.createElement("ul")
    }

    // 收起或者展开树形列表项。如果点击区域在子列表上则不切换收起状态。
    toggleExpandStatus(event: MouseEvent) {

        const { currentNode, nodeElement } = this.getTriggerEventNode(event)

        if (!currentNode) return

        currentNode.expanded = !currentNode.expanded

        const node__children = nodeElement.querySelector(".node__children")
        const expand_icon = nodeElement.querySelector(".expand_icon")

        if (currentNode.expanded == true) {
            node__children.classList.remove("hidden")
            if (expand_icon.innerText.length > 0) {
                expand_icon.innerText = "-"
            }

        } else {
            node__children.classList.add("hidden")
            if (expand_icon.innerText.length > 0) {
                expand_icon.innerText = "+"
            }
        }
    }

    // 递归地获取树形结构的 HTML Text
    getHtmlFromTreeNode(treeRootNode: TreeNode, floor: number) {

        const result: string[] = [];

        treeRootNode.children.forEach(childNode => {
            let icon = childNode.children.length > 0 ? '+' : '';
            let childrenHtml = this.getHtmlFromTreeNode(childNode, floor + 1)
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
    public render(container: HTMLElement) {
        const html = this.getHtmlFromTreeNode(this.rootNode, 0);
        this.listBody.innerHTML = html
        container.appendChild(this.listBody)
    }

    // 给列表节点绑定外部传入的事件(将事件代理到最顶层节点)
    public bindEvents(nodeEvents: any[] = []) {

        if (!this.listBody) return console.error("listbody ul did not created")

        this.listBody.addEventListener("click", this.toggleExpandStatus.bind(this))

        nodeEvents.forEach(({ eventName, callback }) => {
            // 给传入的事件注入所需参数(触发的节点)
            const wrappedEvent = (event: MouseEvent) => {
                const { currentNode, nodeElement } = this.getTriggerEventNode(event)
                callback(event, currentNode)
            }
            this.listBody.addEventListener(eventName, wrappedEvent as any)
        })

    }

    // 根据点击事件查找当前节点
    getTriggerEventNode(event: MouseEvent) {
        const el = event.target as HTMLElement
        if (!el.classList.contains("node__name")) return {}

        const nodeElement = el.closest(".node") as any;
        const nodeId = nodeElement.dataset.nodeId;
        const currentNode = this.getNodeById(nodeId, this.rootNode)

        return { currentNode, nodeElement }
    }

    // 根据 id 查找节点，如果未找到返回 null - DFS 
    getNodeById(id: string, treeRoot: TreeNode = this.rootNode): TreeNode | null {
        if (treeRoot.id === id) return treeRoot;

        for (let i = 0; i < treeRoot.children.length; i++) {
            const match = this.getNodeById(id, treeRoot.children[i]);
            if (match !== null) return match;
        }

        return null;
    }
}
