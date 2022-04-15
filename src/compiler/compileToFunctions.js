/*
 * @Author: zhouzhishou
 * @Date: 2022-04-14 00:22:41
 * @Description: 
 */
import generate from './generateCode'
import parseHTML from './parseHTML'

function compileToFunctions(template) {
    let ast = parseHTML(template)
    let code = generate(ast)
    let render = `with(this){ return ${code} }`
    let renderFn = new Function(render)
    return renderFn
}

export default compileToFunctions

