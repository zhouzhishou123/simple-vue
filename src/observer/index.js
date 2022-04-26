/*
 * @Author: zhouzhishou
 * @Date: 2022-04-26 19:25:21
 * @Description: server
 */

import { isObject, isArray } from '../utils/index'
import { arrayMethods } from './array'

export function observe(value) {
    //只对对象观测
    if (!isObject(value)) return

    let ob = new Observer(value)
    return ob
}


// 定义响应式数据

function defineReactive(obj, key, value) {
    // 如果value还是一个对象则继续观测
    observe(value)
    // new Observer(value)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            // console.log('获取值');
            return value
        },
        set(newVal) {
            if (newVal === value) return
            console.log('更新值');
            value = newVal
            //如果newVal是一个对象继续观测
            observe(value)
        }
    })
}


class Observer {
    constructor(value) {
        this.value = value

        Object.defineProperty(value, '__ob__', {
            enumerable: false,
            configurable: false,
            value: this
        })
        if (isArray(value)) {
            //对数组进行观测
            value.__proto__ = arrayMethods
            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }
    walk(value) {
        for (let key in value) {
            defineReactive(value, key, value[key])
        }
    }
    observeArray(value) {
        for (let i = 0; i < value.length; i++) {
            observe(value[i]);
        }
    }
}