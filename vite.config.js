import commonjs from "rollup-plugin-commonjs";
import externalGlobals from "rollup-plugin-external-globals";
import vue from "@vitejs/plugin-vue";

const path = require("path")

export default ({ mode }) => {

    const IS_PROD = mode === "production";
    console.log("\n > build mode:", `"${mode}"`);

    return {
        plugins: [vue()],
        // base: "./",
        resolve: {
          alias: {
            // 键必须以斜线开始和结束
            "@": path.resolve(__dirname, "./src")
            // '/@components/': path.resolve(__dirname, './src/components')
          }
        },
        build: {
            manifest: true,
            rollupOptions: {
                input: "./index.html",
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
