const http = require('http');
const url = require('url');

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
                <a href="#">create</a>
                <div id="board_list" align="center">
                    <p>
                        article list
                    </p>
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
            <form action method="https://localhost:3000/create_article">
                <p>
                    <input name="title" type="text">
                </p>
                <p>
                    <textarea name="article" cols="50" rows="50"></textarea>
                </p>
            </form>
        `
    }

    if (pathname === '/') {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(templateHTML(templateIndexHTML()));
    } else if (pathname === '/create_article') {
    
    } else {
        const template404Page = `<h1 align='center'>404 Not Found</h1>`
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end(template404Page);
    }
    

}).listen(3000);