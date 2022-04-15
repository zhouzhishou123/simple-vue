/*
 * @Author: zhouzhishou
 * @Date: 2022-04-12 20:48:58
 * @Description: 
 */
// rollup.config.js
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel'
import rollupTypescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import serve from 'rollup-plugin-serve'
import { nodeResolve } from '@rollup/plugin-node-resolve';
export default {
    input: 'src/main.js',
    output: [
        {
            file: 'lib/vue.esm.js', // package.json 中 "module": "dist/index.esm.js"
            format: 'esm', // es module 形式的包， 用来import 导入， 可以tree shaking
            sourcemap: true,
            name: 'simpleVue',
        }, {
            file: 'lib/vue.cjs.js', // package.json 中 "main": "dist/index.cjs.js",
            format: 'cjs', // commonjs 形式的包， require 导入 
            sourcemap: true,
            name: 'simpleVue',
        }, {
            file: 'lib/vue.umd.js',
            name: 'simpleVue',
            format: 'umd', // umd 兼容形式的包， 可以直接应用于网页 script
            sourcemap: true
        }
    ],
    plugins: [
        json(),
        resolve(),
        babel({
            exclude: 'node_modules/**' // 只编译我们的源代码
        }),
        // 使得 rollup 支持 commonjs 规范，识别 commonjs 规范的依赖
        commonjs(),
        // rollupTypescript(),
        serve({
            host: 'localhost',
            port: 8000,
            contentBase: '',
            openPage: '/index.html'
        }),
        babel({
            runtimeHelpers: true,
            // 只转换源代码，不运行外部依赖
            exclude: 'node_modules/**',
            // babel 默认不支持 ts 需要手动添加
            // extensions: [
            //     ...DEFAULT_EXTENSIONS,
            //     '.ts',
            // ],
        }),
        nodeResolve()
    ],
    watch: {
        exclude: 'node_modules/**'
    }
};

