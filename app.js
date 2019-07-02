const http = require('http');
const url = require('url');
const qs = require('querystring');
const fs = require('fs');

const app = http.createServer((req, res) => {
    const currentURL = req.url
    const pathname = url.parse(currentURL).pathname;
    
    const templateHTML = (content) => {
        return `
            <!DOCTYPE html>
            <html lang="ko">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Test Board</title>
                <style>
                    #board_list {
                        border: 3px solid black;
                    }
                </style>
            </head>
            <body>
                <h1 align="center"><a href="/">Board</a></h1>
                <a href="create">create</a>
                <div id="board_list" align="center">
                    ${content}
                </div>
            </body>
            </html>
        `;
    }

    const templateIndexHTML = (articleList) => {
        return `
            <p>
                ${articleList}
            </p>
        `
    }

    const templateCreateHTML = () => {
        return `
        <form action="http://localhost:3000/create_article" method="post">
            <p>
                <input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="article" placeholder="article"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
        `
    }

    if (pathname === '/') {
        fs.readdir("./data", (err, items) => {
            if (err) {
                return;
            }
            let articleListHTML = '<ol>';
            for (let i=0; i<items.length; i++) {
                articleListHTML += `<li> <a href="article-${items[i]}"> ${items[i]} </a> </li>`
            }
            articleListHTML += '</ol>'
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(templateHTML(templateIndexHTML(articleListHTML)));
        });

        
    } else if (pathname === '/create') {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(templateHTML(templateCreateHTML()));
    } else if (pathname === '/create_article') {
        let body = '';
        req.on('data', (data) => {
            body = body + data;
        });
        req.on('end', () => {
            const post = qs.parse(body);
            const title = post.title;
            const article = post.article;
            
            fs.writeFile(`data/${title}`, article, 'utf8', (err) => {
                res.writeHead(302, {Location: `/article-${title}`});
                res.end();
            })
        });
    } else if (pathname.includes("/article-")) {
        const title = pathname.split("-")[1];
        fs.readFile(`./data/${title}`, 'utf8', (err, article) => {
            if (err) {
                return;
            }
            const body = `<h2> ${title} </h2> <p> ${article} <p>`
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(templateHTML(body));
        });

    } else {
        const template404Page = `<h1 align='center'>404 Not Found</h1>`
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end(template404Page);
    }
    

    30
}).listen(3000);