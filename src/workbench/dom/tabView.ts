/*
 * @Author: Luzy
 * @Date: 2023-09-03 17:40:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-06 23:53:07
 * @Description: tabs横向列表组件 用于文件展示等功能
 */
import { getFileName, stringHash } from '../utils'
export class TabView {
    readonly files: string[]
    readonly ItemList: Map<string, HTMLElement> = new Map()

    tabsBody!: HTMLElement

    constructor(files: any) {
        this.files = files;
        this.tabsBody = this.initTabsBody()
    }


    initTabsBody() {
        const ul = document.createElement("ul")
        ul.classList.add("filetab_ul")
        return ul
    }

    getHtmlFromFileList() {
        let html = ''

        for (let i = 0; i < this.files.length; i++) {
            const path = this.files[i]
            html += `
            <div class="filetab_item">
                <div class="file_name">${path}</div>
                <div class="close_button">x</div>
            </div>

            `
        }

        return html
    }

    render(container: HTMLElement) {
        const html = this.getHtmlFromFileList();
        this.tabsBody.innerHTML = html
        container.appendChild(this.tabsBody)
    }

    addFile(path: string) {
        this.files.push(path)
        const tabItem = this.createTabItem(path)
        this.tabsBody.appendChild(tabItem)
        this.focus(path)

        return tabItem
    }

    createTabItem(path: string) {
        const tabItem = document.createElement("div")
        tabItem.classList.add("filetab_item")
        tabItem.id = this.generateId(path)

        const fileName = getFileName(path)

        tabItem.innerHTML = `
        <div class="file_name">${fileName}</div>
        <div class="close_button">x</div>
        `

        this.ItemList.set(path, tabItem)

        return tabItem
    }

    // 切换focus项
    focus(path: string) {
      
        const tabItem = this.ItemList.get(path)
        const activeItem = this.tabsBody.querySelector(".focus")

        if (activeItem) {
            activeItem.classList.remove("focus")
        }

        if (tabItem) {
            tabItem.classList.add("focus")
        }

    }

    // 生成文件ID
    generateId(path: string) {
        return `fileTab_${stringHash(path)}`
    }
}