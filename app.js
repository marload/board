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
                <h1 align="center">Board</h1>
                <a href="create">create</a>
                <div id="board_list" align="center">
                    ${content}
                </div>
            </body>
            </html>
        `
    }

    const templateIndexHTML = () => {
        return `
            <p>
                article list
            </p>
        `
    }

    const templateCreateHTML = () => {
        return `
        <form action="http://localhost:3000/create_article" method="post">
            <p>
                <input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="article"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
        `
    }

    if (pathname === '/') {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(templateHTML(templateIndexHTML()));
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
                res.writeHead(302, {Location: `/`});
                res.end();
            })
        });
    } else {
        const template404Page = `<h1 align='center'>404 Not Found</h1>`
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end(template404Page);
    }
    

}).listen(3000);