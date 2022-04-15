/*
 * @Author: zhouzhishou
 * @Date: 2022-04-14 04:41:26
 * @Description: 
 */
import createElement from './createElement'

function patch(oldVNode, newVNode) {
    //首先要先把虚拟dom转换成真实dom
    let elm = createElement(newVNode)
    const parentNode = oldVNode.parentNode
    // 替换原来的元素
    parentNode.insertBefore(elm, oldVNode.nextSibling)
    // 删除原来的节点
    parentNode.removeChild(oldVNode)

}

export default patch