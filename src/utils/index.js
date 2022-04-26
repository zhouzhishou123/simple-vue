/*
 * @Author: zhouzhishou
 * @Date: 2022-04-26 19:31:15
 * @Description: 
 */

export function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

export function isArray(value) {
    return Array.isArray(value)
}