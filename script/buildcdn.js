const fs = require("fs-extra");
const path = require("path");

const cdn = {
    js: [
        "https://unpkg.com/vue@next",
        "https://unpkg.com/vue-router@4.0.4/dist/vue-router.global.js",
        "https://unpkg.com/vuex@3.6.2/dist/vuex.js",
        "https://unpkg.com/element-plus/lib/index.full.js"
    ],
    css: [
        // "https://unpkg.com/element-plus/lib/theme-chalk/index.css"
    ]
}

fs.readFile(path.join(process.cwd(), 'dist/index.html'), 'utf8', function (err, data) {
    if (err) throw err;

    const cdnJSString = cdn.js.map(path => {
        return `<script crossorigin async src="${path}"></script>
`
    }).join("").concat("</body>");

    const cdnCSSString = cdn.css.map(path => {
        return `<link rel="stylesheet" href="${path}">
`
    }).join("").concat("</head>");

    const htmlString = data.toString()
        .replace(/<\/body>/g, cdnJSString)
        .replace(/<\/head>/g, cdnCSSString);

    fs.writeFile(path.join(process.cwd(), 'dist/index.html'), htmlString, function (err) {
        if (err) throw err;
        console.log("rewrite success")
    });
})
