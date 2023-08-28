/*
 * @Author: Luzy
 * @Date: 2023-08-28 15:44:47
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-28 15:49:15
 * @Description: 用于网络服务通信的后端MVC架构模式 ， 被ProtocolService调用
 * 调用暴露的API服务并通过网络返回给浏览器
 */

import { parseUrlQuery } from '../utils'
import { apiFactory, LZY_API } from './apiFactory';



type ResCb = (response: string | Electron.ProtocolResponse) => void
type EReq = Electron.ProtocolRequest

// 路由
function router(req: EReq, cb: ResCb, c: Controller) {
    console.log(req);

    const { url } = req
    const urlPart = url.split("?")[0]
    const params = parseUrlQuery(url)

    switch (urlPart) {
        case "lzy://api/test": c.test(params, cb)
            break;
        default:
    }
}


// 控制器
class Controller {
    // 测试网络请求方法
    test(params: Record<string, string>, callback: ResCb) {
        const response = {
            statusCode: 200,
            headers: { 'content-type': 'application/json' },
            data: JSON.stringify({ status: 200, data: "SUCCESS TEST" })
        }

        callback(response)
    }
}


// Service(由factory提供直接serviceAPI)
class Service {
    API: LZY_API = apiFactory()
}






export function useMVC(req: EReq, cb: ResCb) {
    router(req, cb, new Controller())
}