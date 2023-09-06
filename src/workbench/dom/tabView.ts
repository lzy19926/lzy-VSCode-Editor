/*
 * @Author: Luzy
 * @Date: 2023-09-03 17:40:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-06 18:00:07
 * @Description: tabs横向列表组件 用于文件展示等功能
 */
import { getFileName } from '../utils'
export class TabView {
    readonly files: string[]
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

    addFile(path: string, id: string) {
        this.files.push(path)
        const tabItem = this.createTabItem(path, id)
        this.tabsBody.appendChild(tabItem)
        this.focus(id)
    }

    createTabItem(path: string, id: string) {
        const tabItem = document.createElement("div")
        tabItem.classList.add("filetab_item")
        tabItem.id = `fileTab_${id}`

        const fileName = getFileName(path)

        tabItem.innerHTML = `
        <div class="file_name">${fileName}</div>
        <div class="close_button">x</div>
        `

        return tabItem
    }

    // 切换focus项
    focus(id: string) {
        const domId = `fileTab_${id}`
        const tabItem = this.tabsBody.querySelector(`#${domId}`)
        const activeItem = this.tabsBody.querySelector(".focus")

        if (activeItem) {
            activeItem.classList.remove("focus")
        }

        if (tabItem) {
            tabItem.classList.add("focus")
        }

    }
}