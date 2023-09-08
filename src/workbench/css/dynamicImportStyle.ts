/*
 * @Author: Luzy
 * @Date: 2023-09-08 10:53:27
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-08 10:59:16
 * @Description: 统一对CSS进行引入(可换成更好的方式?)
 */


export const dynamicImportStyle = () => {
    /**@ts-ignore*/
    import(/* webpackChunkName: "app" */ './global.css');
    /**@ts-ignore*/
    import(/* webpackChunkName: "app" */ './editor.css');
    /**@ts-ignore*/
    import(/* webpackChunkName: "app" */ './fileTab.css');
    /**@ts-ignore*/
    import(/* webpackChunkName: "app" */ './sideBar.css');
    /**@ts-ignore*/
    import(/* webpackChunkName: "app" */ './terminal.css');
    /**@ts-ignore*/
    import(/* webpackChunkName: "app" */ './titleBar.css');
}


