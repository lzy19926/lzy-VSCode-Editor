/*
 * @Author: Luzy
 * @Date: 2023-09-03 17:40:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-04 21:35:11
 * @Description: tabs横向列表组件 用于文件展示等功能
 */

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

    addFile(id: string) {
        debugger
        this.files.push(id)
        const tabItem = this.createTabItem(id)
        this.tabsBody.appendChild(tabItem)
    }

    createTabItem(path: string) {
        const tabItem = document.createElement("div")
        tabItem.classList.add("filetab_item")

        tabItem.innerHTML = `
        <div class="file_name">${path}</div>
        <div class="close_button">x</div>
        `

        return tabItem
    }

}