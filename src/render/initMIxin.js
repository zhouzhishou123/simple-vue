/*
 * @Author: zhouzhishou
 * @Date: 2022-04-14 04:11:46
 * @Description: 
 */

import patch from '../patch/patch'
import { observe } from '../observer/index'
function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options

        //初始化数据
        initState(vm)

        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype._update = function (vnode) {
        const vm = this
        vm.$el = patch(vm.$el, vnode)
    }
}


function initState(vm) {
    // 如果存在data初始化
    if (vm.$options.data) {
        initData(vm, vm.$options.data)
    }
}

function initData(vm) {
    let data = vm.$options.data
    data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}

    //观测data变成响应式数据
    observe(data)
    // 代理
    for (let key in data) {
        proxy(vm, '_data', key)
    }
}
function proxy(vm, sourceKey, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[sourceKey][key]
        },
        set(newVal) {
            vm[sourceKey][key] = newVal
        }
    })
}


export default initMixin