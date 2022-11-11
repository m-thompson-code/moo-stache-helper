const { readFile, writeFile, copy, emptyDir, ensureDir } = require("fs-extra");
const path = require("path");

/**
 * Options:
 * index: path to html entry point for canjs app. Default is 'index.html'
 * 
 * stealConfig: path to steal config. Used for development of canjs app only.
 * 
 * port: port number for server. Default is 8080
 * 
 * dirname: absolute path to root of canjs project
 */
module.exports = async function migrateToDist(options={}) {
    console.log(options);

    const CWD = options.cwd || process.cwd();
    const ROOT = options.root || '';
    const INDEX_HTML = options.index || 'index.html';
    const COPY_PATHS = options.copyPaths || [];
    const DIST = options.dist;

    const distPath = path.join(CWD, DIST);
    const indexHtmlPath = path.join(CWD, ROOT, INDEX_HTML);
    const indexHtmlDistPath = path.join(distPath, INDEX_HTML);

    const promises = [];

    promises.push(copyProductionHtml(indexHtmlPath, indexHtmlDistPath, ROOT))

    for (const copyPath of COPY_PATHS) {
        const from = path.join(CWD, ROOT, copyPath);
        const to = path.join(distPath, copyPath);
        
        await ensureDir(to);
        await emptyDir(to);

        promises.push(copy(from, to));
    }

    await Promise.all(promises);
}

async function copyProductionHtml(index, dist, root) {
    const html = await readFile(index, "utf8");

    await writeFile(dist, html.replace(
        '{{ scripts }}', 
        `<script src="${path.join('/dist/bundles', root, '/app/app.js')}" main></script>`
    ));
}
