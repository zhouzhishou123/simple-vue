/*
 * @Author: zhouzhishou
 * @Date: 2022-04-14 04:11:46
 * @Description: 
 */

import patch from '../patch/patch'
function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options

        // 如果存在data初始化
        if (vm.$options.data) {
            initData(vm, vm.$options.data)
        }

        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype._update = function (vnode) {
        const vm = this
        patch(vm.$el, vnode)
    }
}

function initData(vm, data) {
    vm._data = typeof data === 'function' ? data.call(vm) : data
    let _data = vm._data
    // 代理
    for (let key in _data) {
        proxy(vm, key, _data[key])
    }
}
function proxy(vm, key, val) {
    Object.defineProperty(vm, key, {
        get() {
            return val
        },
        set(newVal) {
            val = newVal
        }
    })
}


export default initMixin