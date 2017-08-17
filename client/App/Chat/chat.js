const io = require('socket.io-client');
const STATIC_TEXT = require('../../../lib/staticText.js');
var Chat = function () {
    this.onNameResult; //改名结果回调
    this.onJoinResult; //显示房间变更回调
    this.onMessage; //收到信息回调
    this.onRoomResult; //收到显示可用房间列表回调
}

/**
 *初始化
 */
Chat.prototype.init = function ({ onNameResult, onJoinResult, onMessage, onRoomResult }) {
    this.onNameResult = onNameResult;
    this.onJoinResult = onJoinResult;
    this.onMessage = onMessage;
    this.onRoomResult = onRoomResult;
    return this;
}

/**
 *连接
 */
Chat.prototype.connect = function () {
    var url = 'http://localhost:8624';
    var socket = io.connect(url); //这里可以填地址
    this.socket = socket;

    socket.on(STATIC_TEXT.NAME_RESULT, function (result) { // 改名结果
        this.onNameResult && this.onNameResult(result);
    }.bind(this));

    socket.on(STATIC_TEXT.JOIN_RESULT, function (result) { // 加入房间结果
        this.onJoinResult && this.onJoinResult(result);
    }.bind(this));

    socket.on(STATIC_TEXT.MESSAGE, function (result) { // 信息
        console.log(result);
        this.onMessage && this.onMessage(result);
    }.bind(this));

    socket.on(STATIC_TEXT.ROOMS, function (result) { // 房间列表
        this.onRoomResult && this.onRoomResult(result);
    }.bind(this));

    //this._loopGetRoomList(socket);
}



//循环获取房间列表
Chat.prototype._loopGetRoomList = function (socket) {
    if (!socket) return;
    setInterval(function () {
        socket.emit(STATIC_TEXT.ROOMS);
    }, 10000);
}

/**
 *发送消息function
 * @param {String} room 
 * @param {String} text  
 */
Chat.prototype.sendMessage = function (room, text) {
    var message = {
        room: room,
        text: text
    }
    this.socket.emit(STATIC_TEXT.MESSAGE, message);
}

/**
 * 变更房间的函数
 */
Chat.prototype.changeRoom = function (room) {
    this.socket.emit(STATIC_TEXT.JOIN,
        { newRoom: room }
    );
}

/**
 * 处理聊天命令
 */
Chat.prototype.processCommand = function (command) {
    var words = command.split(' ');
    var command = words[0].substring(1, words[0].length).toLowerCase(); //从第一个单词开始解析

    var message = false;

    switch (command) {
        case 'join':    //房间变换
            words.shift();
            var room = words.join(' ');
            this.changeRoom(room);
            break;
        case 'nick':    //更名
            words.shift();
            var name = words.join(' ');
            this.socket.emit('join',
                { nameAttempt: name }
            );
            break;
        default:
            message = "不知道你想怎么样";
            break;

    }
    return message;
}

module.exports = new Chat;


