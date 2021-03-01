import commonjs from "rollup-plugin-commonjs";
import externalGlobals from "rollup-plugin-external-globals"
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
// export default defineConfig({
//     plugins: [vue()],
//     publicDir: "",
//     build: {
//         rollupOptions: {
//             external: ["vue", "element-plus", "vue-router"],
//             plugins: [
//                 commonjs(),
//                 externalGlobals({
//                     vue: "Vue",
//                     "element-plus": "ElementPlus",
//                     "vue-router": "VueRouter"
//                 })
//             ]
//         }
//     }
// })

export default ({ command, mode }) => {
    const IS_PROD = mode === "production";
    console.log("mode:", mode);

    // 入口页面
    const PUBLIC_DIR = IS_PROD ? "" : "";
    return  {
        plugins: [vue()],
        publicDir: mode === "p",
        build: {
            rollupOptions: {
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
