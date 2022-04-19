/*
 * @Author: zhouzhishou
 * @Date: 2022-04-14 03:22:07
 * @Description: 
 */

/**
 * vnode的类型
 * 1.注释节点
 * 2.文本节点
 * 3.元素节点
 * */

class VNode {
    constructor(vm, tag, data = {}, children = [], text = undefined, elm = null) {
        // 标签
        this.tag = tag
        // 属性
        this.data = data
        //子节点
        this.children = children
        //文本
        this.text = text
        //真实dom
        this.elm = elm
        // 当前组件实例
        this.context = vm
        this.key = data.attrs && data.attrs.key
    }
}


// 创建一个注释虚拟节点
export function createEmptyVNode(vm, text) {
    const node = new VNode(vm, undefined, undefined, undefined, text)
    node.isComment = true
    return node
}

// 创建一个文本虚拟节点
export function createTextVNode(vm, text) {
    return new VNode(vm, undefined, undefined, undefined, text)
}

// 创建一个元素的虚拟节点
export function createElementVNode(vm, tag, data, children) {

    return new VNode(vm, tag, data, children, undefined)
}


export function emptyNodeAt(elm) {
    return new VNode(undefined, elm.tagName.toLowerCase(), undefined, undefined, undefined, elm)
}