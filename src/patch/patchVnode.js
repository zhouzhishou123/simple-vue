/*
 * @Author: zhouzhishou
 * @Date: 2022-04-18 00:47:42
 * @Description:
 */


import createElement from './createElement'
import { sameVnode } from './patch'

export default function patchVnode(oldVnode, vnode) {
    // debugger
    if (vnode.text) {
        // 新旧节点是同一个节点时 都是文本节点
        // 重新设置oldVnode在视图中对应的真实DOM节点的文本
        oldVnode.elm.textContent = vnode.text
    } else {
        // 都是元素节点
        // 新虚拟节点有子节点的情况
        if (vnode.children && vnode.children.length > 0) {
            // 如果旧节点没有子节点 把新虚拟节点的子节点插入到旧节点中
            if (!oldVnode.children || oldVnode.children.length === 0) {
                let children = vnode.children
                let oldElm = oldVnode.elm
                children.forEach((child) => {
                    oldElm.appendChild(createElement(child))
                })
            } else {
                let newChild = vnode.children
                let oldChild = oldVnode.children
                let parentElm = oldVnode.elm
                // 新旧节点都存在子节点
                updateChildren(parentElm, oldChild, newChild)
            }
        } else {
            // 新虚拟节点没有子节点 删除旧节点的子节点
            let elm = oldVnode.elm
            if (elm.hasChildNodes()) {
                // 如果旧节点存在子节点则删除子节点
                let children = elm.childNodes
                children.forEach((child) => {
                    elm.removeChild(child)
                })
            }
        }
    }
}


// 更新子节点
function updateChildren(parentElm, oldChild, newChild) {

    let newStartIdx = 0
    let newEndIdx = newChild.length - 1
    let oldStartIdx = 0
    let oldEndIdx = oldChild.length - 1
    let newStartVnode = newChild[0]
    let newEndVnode = newChild[newEndIdx]
    let oldStartVnode = oldChild[0]
    let oldEndVnode = oldChild[oldEndIdx]
    let refElm

    /**
     * 优化策略
     * 1. 新前和旧前
     * 2. 新后和旧后
     * 3. 新前和旧后
     * 4. 新后和旧前
     */
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (!oldChild[oldStartIdx]) { //如果oldStartVnode被移动走了 设置为下一个节点
            oldStartVnode = oldChild[++oldStartIdx]
        } else if (!oldChild[oldEndIdx]) { // 如果oldEndVnode被移动走了 oldEndVnode移动到前一个节点
            oldEndVnode = oldChild[--oldEndIdx]
        } else if (sameVnode(oldStartVnode, newStartVnode)) { // 新前和旧前是同一个节点，比对更新两个节点都移动到下一个节点
            patchVnode(oldStartVnode, newStartVnode)
            newStartVnode = newChild[++newStartIdx]
            oldStartVnode = oldChild[++oldStartIdx]
        } else if (sameVnode(oldEndVnode, newEndVnode)) { // 新后和旧后是同一个节点比对更新，两个节点都移动到前一个节点
            patchVnode(oldEndVnode, newEndVnode)
            oldEndVnode = oldChild[--oldEndIdx]
            newEndVnode = newChild[--newEndIdx]
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // 旧前和新后是同一个节点,比对更新，oldStartVnode插入到oldEndVnode后面 oldStartVnode向后移动，newEndVnode向前移动
            patchVnode(oldStartVnode, newEndVnode)
            parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSilbing)
            oldStartVnode = oldChild[++oldStartIdx]
            newEndVnode = newChild[--newEndIdx]
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // 旧后和新前是同一个节点,比对更新,把oldEndVnode移动到oldStartVnode的前面,oldEndVnode向前移动，newStartVnode向后移动
            patchVnode(oldEndVnode, newStartVnode)
            parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
            oldEndVnode = [--oldEndIdx]
            newStartVnode = [++newStartIdx]
        } else { // 以上四种优化策略都不符合条件
            const map = {} // 旧节点的关于key的映射表
            oldChild.forEach((childVnode, index) => {
                let key = childVnode.key || index
                map[key] = index
            })
            let idxInOld = map[newStartVnode.key]
            if (idxInOld) { // oldChild中存在与newStartVnode相同的节点则复用,将他们对比更新
                patchVnode(oldChild[idxInOld], newStartVnode)
                let oldVnode = oldChild[idxInOld]
                // 将oldChild中的清空
                oldChild[idxInOld] = undefined
                // 把找到的这个节点插入到oldStartVnode前面
                parentElm.insertBefore(oldVnode.elm, oldStartVnode.elm)
                // 将newStartVnode移动到下一个节点
                newStartVnode = [++newStartIdx]
            } else { // oldChild找不到与newStartVnode相同的节点则使用newStartVnod创建新节点插入到oldStartVnode的前面将newStartVnode移动到下一个节点
                parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
                newStartVnode = newChild[++newStartIdx]
            }

        }
    }

    //如果新虚拟节点最先比对结束
    if (newStartIdx > newEndIdx) {
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
            parentElm.removeChild(oldChild[i].elm)
        }
    }
    // 如果旧虚拟节点最先比对结束
    if (oldStartIdx > oldEndIdx) {
        refElm = newChild[newEndIdx + 1] ? oldStartVnode.elm : oldEndVnode.elm
        for (let i = newStartIdx; i <= newEndIdx; i++) { // newStartIdx newEndIdx
            parentElm.insertBefore(createElement(newChild[i]), refElm)
        }
    }
}