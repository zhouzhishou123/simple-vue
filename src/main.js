/*
 * @Author: zhouzhishou
 * @Date: 2022-04-12 20:47:58
 * @Description:
 */

import renderMixin from './render/renderMixin'
import initMixin from './render/initMIxin'

function Vue(options) {
    // 初始化数据
    this._init(options)
}

initMixin(Vue)
renderMixin(Vue)

export default Vue

let vm = new Vue({
    el: '#app',
    template: `<div key="a">
                    {{name}} {{age}}
               </div>`,
    data() {
        return {
            name: 'world',
            age: 90,
            arr: [1, 2, 3, 4]
        }
    }
})

vm.arr.push(5, [6, 7], 8, { a: 90 })