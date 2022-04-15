/*
 * @Author: zhouzhishou
 * @Date: 2022-04-12 22:29:59
 * @Description:
 */
import {
    ncname,
    qnameCapture,
    startTagOpen,
    endTag,
    attribute,
    startTagClose,
    defaultTagRE,
    commentReg,
} from '../utils/regexps'


function createASTElement(tag, attrs, parent = null, unary) {
    return {
        tag,
        type: 1,
        attrs,
        parent,
        unary, // 是否是自闭合标签
        children: []
    }
}

/**
 * @param {string} html
 * @return {*}
 * @Description: html解析器 AST对象
 */
function parseHTML(html) {
    if (html === null || html === undefined) {
        throw new TypeError('参数类型错误')
    }
    let root = null,
        stack = [],
        currentParent = null,
        astElement

    /**
     * html解析器解析触发的钩子函数
     */
    // 解析开始标签触发的钩子函数
    function start(tag, attrs, unary) {
        unary ? unary = true : unary = false
        // 创建一个AST元素
        let element = createASTElement(tag, attrs, null, unary)
        // 如果当前的栈是空的
        if (stack.length === 0) {
            // 当前的元素就是根节点
            root = element
        } else {
            element.parent = currentParent
            currentParent.children.push(element)
        }
        stack.push(element)
        currentParent = stack[stack.length - 1]
        // console.log(tag, stack, '===解析开始标签===')
    }
    //解析结束标签触发的钩子函数
    function _end() {
        // console.log('解析结束标签')
        stack.pop()
        currentParent = stack[stack.length - 1]
    }
    //解析文本触发的钩子函数
    function chars(text) {
        text = text.trim()
        if (text) {
            // let children = currentParent.children
            let expression = parseText(text)
            if (expression) {
                currentParent.children.push({
                    type: 2,
                    expression,
                    text
                })
            } else {
                currentParent.children.push({
                    type: 3,
                    text
                })
            }
        }
    }
    //解析注释标签触发的钩子函数
    function comment(text) {
        text = text.trim()
        if (text) {
            currentParent.children.push({
                type: 3,
                text,
                isComment: true
            })
        }
    }

    function parseText(text) {
        //判断有没有变量
        if (!defaultTagRE.test(text)) return
        const tokens = []
        defaultTagRE.lastIndex = 0
        let match, lastIndex = 0
        while (match = defaultTagRE.exec(text)) {
            let index = match.index
            // 截取{{左边的文本添加到tokens里面
            let str = text.slice(lastIndex, index)
            tokens.push(JSON.stringify(str))
            // 把变量转成_s(x)这样的形式
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length
        }

        if (lastIndex < text.length - 1) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        return tokens.join('+')
    }

    function advance(n) {
        html = html.substring(n)
    }

    while (html) {
        // debugger
        let textEnd = html.indexOf('<')
        // 字符串以<开头
        if (textEnd === 0) {

            //解析注释
            const hasComment = commentReg.test(html)
            if (hasComment) {
                //注释的结束为止
                const commentEnd = html.indexOf('-->')
                if (commentEnd >= 0) {
                    let commentStr = html.substring(4, commentEnd)
                    comment(commentStr)
                    advance(commentEnd + 3)
                    continue
                }
            }

            // 解析结束标签
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                _end()
                continue
            }

            let startMatch = html.match(startTagOpen)
            // 如果字符串是以开始标签开始的
            if (startMatch) {
                // console.log(startMatch);
                astElement = {
                    tag: startMatch[1],
                    attrs: [],
                    type: 1,
                }
                advance(startMatch[0].length)
            }

            // 解析属性
            let attr, end
            while (
                !(end = html.match(startTagClose)) &&
                (attr = html.match(attribute))
            ) {
                end = html.match(startTagClose)
                attr = html.match(attribute)
                astElement.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5],
                })
                advance(attr[0].length)
            }
            // 是否是自闭合标签
            if (end) {
                astElement.unarySlash = end[1]
                advance(end[0].length)
                // 如果是自闭合标签
                if (end[1]) {
                    // _end()
                }
            }
            start(astElement.tag, astElement.attrs, astElement.unarySlash)
            continue
        }

        let text
        // console.log(html, 'html');
        //整个都是文本
        if (textEnd < 0) {
            text = html
            chars(text)
            advance(text.length)
        }
        // let rest, next, text
        // 解析文本 先不考虑<e2e<we2po<p></p>这种情况
        if (textEnd > 0) {
            text = html.substring(0, textEnd)
            chars(text)
            advance(textEnd)
        }

    }
    return root
}

export default parseHTML
