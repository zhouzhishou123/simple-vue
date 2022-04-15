/*
 * @Author: zhouzhishou
 * @Date: 2022-04-13 22:54:05
 * @Description: 
 */
import parseHTML from './parseHTML'


// 生成attr

function genAttrs(attrs) {
    let str = ''
    let len = attrs.length
    for (let i = 0; i < len; i++) {
        let attr = attrs[i]
        let suffix = ','
        if (i === len - 1) { suffix = "" }
        str += `${attr.name}: ${JSON.stringify(attr.value)}${suffix}`
    }
    return `{attrs:{${str}}}`
}

function genNode(node) {
    console.log(node, 'w2');
    // 元素
    if (node.type === 1) {
        return generate(node)
    } else if (node.type === 3 && node.isComment) {
        console.log(node, '2222');
        // 注释
        return `_e(${JSON.stringify(node.text)})`
    } else {
        // 文本
        let text = node.type === 2 ? node.expression : JSON.stringify(node.text)
        return `_v(${text})`
    }
}

// 生成子节点代码
function genChildren(children) {
    return `[${children.map(item => genNode(item)).join(',')}]`
}
// 代码生成器
function generate(ast) {
    let code = `_c('${ast.tag}'${ast.attrs.length ? `,${genAttrs(ast.attrs)}` : ''}${ast.children.length ? `,${genChildren(ast.children)}` : ''})`
    return code
}


export default generate