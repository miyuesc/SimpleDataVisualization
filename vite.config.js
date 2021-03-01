import commonjs from "rollup-plugin-commonjs";
import externalGlobals from "rollup-plugin-external-globals"
import vue from '@vitejs/plugin-vue'

const { resolve } = require('path')

export default ({ mode }) => {

    const IS_PROD = mode === "production";
    console.log("\n > build mode:", `"${mode}"`);

    return {
        plugins: [vue()],
        // base: "./",
        build: {
            manifest: true,
            rollupOptions: {
                input: IS_PROD ? "./build/index.html" : "./index.html",
                external: ["vue", "element-plus", "vue-router"],
                plugins: [
                    commonjs(),
                    externalGlobals({
                        vue: "Vue",
                        "element-plus": "ElementPlus",
                        "vue-router": "VueRouter"
                    })
                ]
            }
        }
    }
}
