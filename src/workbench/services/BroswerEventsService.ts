
/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-26 18:52:15
 * @Description: 用于统一管理浏览器鼠标,键盘等事件的模块
 */
import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { ITextFileService } from './TextFileService'

export class BroswerEventsService {

    constructor(
        @ITextFileService private readonly textFileService: ITextFileService,
    ) {
        this.onSaveFile()
    }

    //todo 使用mousetrap库进行改写
    //-------------------监听ctrl+s键盘事件--------------------
    private onSaveFile() {
        const that = this
        document.addEventListener('keydown', function (event) {
            // 按下 Ctrl 和 s 键
            if (event.ctrlKey && event.keyCode === 83) {
                // 防止浏览器默认行为 
                event.preventDefault();
                console.log('Ctrl+S was pressed');

                that.textFileService.diffCurrentFileModel()
            }
        });
    }

}

export interface IBroswerEventsService {

}

export const IBroswerEventsService = createDecorator<IBroswerEventsService>("IBroswerEventsService")
registerSingleton(IBroswerEventsService, BroswerEventsService)