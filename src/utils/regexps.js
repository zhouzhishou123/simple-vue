/*
 * @Author: zhouzhishou
 * @Date: 2022-04-12 23:03:52
 * @Description: 
 */

export const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 匹配标签名
export const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // 标签名
export const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
export const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
export const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
export const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
export const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
export const commentReg = /^<!--/