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

renderMixin(Vue)
initMixin(Vue)

export default Vue

let vm = new Vue({
    el: '#app',
    template: `<div key="a">
                    <div key="A">A</div>
                    <div key="B">B</div>
                    <div key="C">C</div>
               </div>`,
    data() {
        return {
            name: 'world',
            age: 90
        }
    }
})