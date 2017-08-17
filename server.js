var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var reactDOMServer = require('react-dom/server').renderToString;
var config = require('./config');
var chatServer = require('./lib/chat_server');


//
var cache = {};

//404错误
function send404(response) {
    response.writeHead(404, {
        'Content-Type': 'text/plain'
    });
    response.write('Error 404: resource not found.');
    response.end();
}

/**
 * 提供文件数据
 * @param response 
 * @param filePath 
 * @param fileContents 
 */
function sendFile(response, filePath, fileContents) {
    response.writeHead(200, {
        'Content-Type': mime.lookup(path.basename(filePath))
    });
    response.end(fileContents);
}

/**
 * 提供静态文件服务
 * @param {*} response 
 * @param {*} cache 
 * @param {*} absPath 
 */
function serveStatic(response, cache, absPath) {
    if (cache[absPath]) { //检查文件是否在缓存中
        sendFile(response, absPath, cache[absPath]); //从内存中返回文件
    } else {

        fs.exists(absPath, function (exists) { //检查文件是否存在
            if (exists) {
                fs.readFile(absPath, function (err, data) { //从硬盘中返回文件
                    if (err) {
                        send404(response); //发送404
                    } else {
                        cache[absPath] = data; //加入缓存中
                        sendFile(response, absPath, data); //读取文件并返回
                    }
                });
            } else {
                send404(response); //发送404
            }
        });
    }
}



/**
 * 创建HTTP服务器的逻辑.
 * 
 */
var server = http.createServer(function (request, response) {
    var filePath = false;
    if (request.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + request.url;
    }
    var absPath = './' + filePath;
    console.log(absPath)
    serveStatic(response, cache, absPath);
});



server.listen(config.port, function () {
    console.log(`
----------------Server started------------------

  ChatServer started
  Server listening on port 8624
  http://localhost:${config.port}            
                                 PS: ctrl + .
------------------------------------------------`);
});

chatServer.listen(server);
