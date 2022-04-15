/*
 * @Author: zhouzhishou
 * @Date: 2022-04-14 04:44:29
 * @Description: 
 */
function createElement(vnode) {
    // console.log(vnode, '==123==');
    let element
    //如果是标签元素
    if (typeof vnode.tag === 'string') {
        element = document.createElement(vnode.tag)
        if (vnode.children && vnode.children.length) {
            let children = vnode.children
            for (let i = 0; i < children.length; i++) {
                let child = children[i]
                element.appendChild(createElement(child))
            }
        }
    } else if (vnode.text && vnode.isComment) {
        // 注释节点
        element = document.createComment(vnode.text)
    } else {
        element = document.createTextNode(vnode.text)
    }
    return element
}
export default createElement