/*
 * @Author: zhouzhishou
 * @Date: 2022-04-14 04:41:26
 * @Description: 
 */
import createElement from './createElement'
import { emptyNodeAt } from '../vnode/vnode'
import patchVnode from './patchVnode'

export function sameVnode(oldvnode, vnode) {
    return oldvnode.tag === vnode.tag &&
        oldvnode.key === vnode.key &&
        oldvnode.isComment === vnode.isComment
}


export function patch(oldVnode, vnode) {
    // 旧虚拟节点不存在
    if (oldVnode.nodeType) {
        oldVnode = emptyNodeAt(oldVnode)
        let oldElm = oldVnode.elm;
        let elm = createElement(vnode)
        let parentElm = oldElm.parentNode
        parentElm.insertBefore(elm, oldElm)
        parentElm.removeChild(oldElm)
        return elm
    } else if (!sameVnode(oldVnode, vnode)) { // // 新旧节点不是同一个节点时
        // 使用新的节点插入到旧节点前面,删除旧节点
        let oldElm = vnode.elm = oldVnode.elm
        let parentElm = oldElm.parentNode
        let elm = createElement(vnode)
        parentElm.insertBefore(elm, oldElm)
        parentElm.removeChild(oldElm)
    } else { // 新旧节点是同一个节点时
        patchVnode(oldVnode, vnode)
    }
}

export default patch