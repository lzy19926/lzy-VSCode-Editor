/*
 * @Author: Luzy
 * @Date: 2023-08-25 23:52:42
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-26 18:16:51
 * @Description: preload脚本演示代码
 */

const fs = require("fs")

const button = document.createElement("button")
button.innerText = "读取文件"

button.onclick = () => {
    const buffer = fs.readFileSync("E:\\VS_Code\\\myVSCode\\src\\main\\test.ts")
    console.log(buffer.toString());
}

window.addEventListener("load",()=>{
    document.body.appendChild(button)
})



