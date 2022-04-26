/*
 * @Author: zhouzhishou
 * @Date: 2022-04-14 03:20:26
 * @Description:
 */

import {
    createEmptyVNode,
    createTextVNode,
    createElementVNode,
} from '../vnode/vnode'
import compileToFunctions from '../compiler/compileToFunctions'
import { patch } from '../patch/patch'


function renderMixin(Vue) {
    // 生成元素虚拟dom
    Vue.prototype._c = function (a, b, c) {
        // 1. 当属性为空时有子节点
        if (c === undefined && Array.isArray(b)) {
            c = b
            b = undefined
        }
        // 属性存在但是没有子节点 b && c === undefined
        const vm = this
        return createElementVNode(vm, a, b, c)
    }

    // 生成文本虚拟dom
    Vue.prototype._v = function (text) {
        const vm = this
        return createTextVNode(vm, text)
    }

    // 生成动态文本虚拟dom
    Vue.prototype._s = function (val) {
        if (typeof val === 'object') {
            return JSON.stringify(val)
        }
        return val
    }
    //生成注释节点
    Vue.prototype._e = function (text) {
        const vm = this
        return createEmptyVNode(vm, text)
    }

    Vue.prototype._render = function () {
        const vm = this
        const { render } = vm.$options
        return render.call(vm)
    }

    //初始化数据
    Vue.prototype.$mount = function (el) {
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)
        let render
        //如果有render函数
        if (options.render) {
            render = options.render
        }
        if (options.template) {
            render = compileToFunctions(options.template)
        }
        options.render = render
        // 开始挂载节点
        mountComponent(vm, el)
    }
}




function mountComponent(vm, el) {
    vm.$el = el
    let vnode = vm.$options.render
    // 更新视图
    vm._update(vm._render())
}

export default renderMixin