const express = require("express");
const path = require("path");
const { readFileSync, readJsonSync, pathExistsSync } = require("fs-extra");

/**
 * Options:
 * 
 * cwd: Current working directory of process. Defaults to `process.cwd()`.
 * 
 * root: relative path from cwd to root of canjs application.
 * 
 * index: relative path from root to entry point index.html.
 * 
 * stealConfig: relative path from root to `steal-config.json`. Used for development of canjs application only.
 * 
 * port: port number for server. Default is 8080
 */
module.exports = async function server(options={}) {
    console.log('moo-stache-helper server', options);

    const app = express();

    const CWD = options.cwd || process.cwd();
    const ROOT = options.root || '';
    const INDEX_HTML = options.index || 'index.html';
    const STEAL_CONFIG_PATH = options.stealConfig;
    const PORT = options.port || 8080;

    app.get("/*", function (req, res) {
        // Serve files from node_modules, etc
        // This assumes that these files have an extension (thus search for a ".")
        if (req.path.includes(".")) {
            const exceptions = [
                "/package.json",
                "package.json",
                "/node_modules",
                "node_modules"
            ];
            if (exceptions.some(exception => req.path.startsWith(exception))) {
                res.sendFile(path.join(CWD, req.path));
            } else {
                res.sendFile(path.join(CWD, ROOT, req.path));
            }
            return;
        }
    
        const indexHtmlPath = path.join(CWD, ROOT, INDEX_HTML);

        const html = getHtml(indexHtmlPath);
        
        if (STEAL_CONFIG_PATH) {
            res.send(injectSteal(html, path.join(CWD, ROOT, STEAL_CONFIG_PATH)));            
            return;
        }

        res.send(html);
    });
    
    app.listen(PORT, function () {
        console.log("Server listening on port ", PORT);
    });

    return app;
}

function getHtml(indexHtmlPath) {
    try {
        const html = readFileSync(indexHtmlPath, "utf8");

        if (!html) {
            throw new Error("Unexpected empty html");
        }

        return html;
    } catch(error) {
        console.error(error);

        throw new Error("Unable to find html entry opint (index.html)");
    }
}

function injectSteal(html, stealConfigPath) {
    const config = readJsonSync(stealConfigPath, "utf8");

    return html.replace('{{ scripts }}', 
    `
        <script
            src="node_modules/steal/steal.js"
            main="app/app">
        </script>
        <script>
            steal.config(${JSON.stringify(config, null, 4)})
            console.log('dev server running', ${JSON.stringify(config)})
        </script>
    `
    );
}

// {
// // module.exports = {
//     "main": "./app/app.js",
//     "babelOptions": {
//         "plugins": ["transform-class-properties"]
//     },
//     "plugins": ["can"],
//     // "plugins": ["can", "steal-css"],
//     // "bundle": [
//     //   "tests/app/progressive-loading-example/nested-request-example/nested-request-example",
//     //   "tests/app/progressive-loading-example/nested-timeout-example/nested-timeout-example"
//     // ]
// }


// <!DOCTYPE html>
// <html lang="en">
// 	<head>
// 		<meta charset="utf-8" />
// 		<title>CanJS App</title>
// 		<base href="/" />
// 		<meta name="viewport" content="width=device-width, initial-scale=1" />
// 		<link rel="icon" type="image/x-icon" href="./assets/favicon.ico" />
// 	</head>
// 	<body>
// 		<can-root></can-root>
// 		<script src="./dist/bundles/app/app.js" main></script>
// 	</body>
// </html>
