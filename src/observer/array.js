/*
 * @Author: zhouzhishou
 * @Date: 2022-04-26 20:21:46
 * @Description: 
 */


let arrayProto = Array.prototype

export let arrayMethods = Object.create(arrayProto)

//七种改变原数组的方法
let methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort']

methods.forEach(method => {
    let original = arrayProto[method] // 数组的原生方法
    arrayMethods[method] = function (...args) {
        let result = original.apply(this, args)
        const ob = this.__ob__
        let inserted
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
                break
            default:
        }
        if (inserted) {
            // 新增的或者替换的数据也需要观测
            ob.observeArray(inserted)
        }
        return result
    }
})