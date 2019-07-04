const http = require('http');
const url = require('url');
const qs = require('querystring');
const fs = require('fs');

const app = http.createServer((req, res) => {
    const currentURL = req.url
    const pathname = url.parse(currentURL).pathname;
    
    const templateHTML = (content, pageButton="") => {
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
                ${pageButton}
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

    const templateWriteHTML = (action, title, article, submit) => {
        return `
        <form action="${action}" method="post">
            <p>
                <input type="text" name="title" placeholder="title" value=${title}></p>
            <p>
                <textarea name="article" placeholder="article">${article}</textarea>
            </p>
            <p>
                <input type="submit" value="${submit}">
            </p>
            <input type="hidden" name="preArticle" value="${title}">
        </form>
        `
    }

    const templateCreateHTML =  () => {
        return templateWriteHTML("http://localhost:3000/create_article", "", "", "제출");
    }

    const templateUpdateHTML = (title, article) => {
        return templateWriteHTML("http://localhost:3000/update_article", title, article, "수정");
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
            res.end(templateHTML(templateIndexHTML(articleListHTML), "<a href='create'>create</a>"));
        });        
    }
    else if (pathname === '/create') {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(templateHTML(templateCreateHTML()));
    }
    else if (pathname === '/create_article') {
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
            });
        });
    }
    else if (pathname.includes("/article-")) {
        const title = pathname.split("-")[1];

        fs.readFile(`./data/${title}`, 'utf8', (err, article) => {
            if (err) {
                return;
            }

            const body = `<h2> ${title} </h2> <p> ${article} <p>`
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(templateHTML(body, `<a href='create'>create</a> <br> <a href='update-${title}'>update</a>`));
        });

    }
    else if (pathname.includes("/update_article")) {
        let body = '';
        req.on('data', (data) => {
            body = body + body;
        });
        console.log(body);
        req.on('end', () => {
            const post = qs.parse(body);
            const title = post.title;
            const article = post.article;
            const preTitle = post.preArticle;
            // TODO Bug fix
            fs.writeFile(`data/${title}`, article, 'utf8', (err) => {
                fs.unlinkSync(`data/${preTitle}`);
                res.writeHead(302, {Location: `/article-${title}`});
            });
            
        })
    }
    else if (pathname.includes("/update-")) {
        const title = pathname.split("-")[1];
        fs.readFile(`./data/${title}`, 'utf8', (err, article) => {
            if (err) {
                return;
            }

            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(templateHTML(templateUpdateHTML(title, article)));
        });
        
    }
    else {
        const template404Page = `<h1 align='center'>404 Not Found</h1>`

        res.writeHead(404, {"Content-Type": "text/html"});
        res.end(template404Page);
    }
}).listen(3000);

