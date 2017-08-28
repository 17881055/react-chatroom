var STATIC_TEXT = require('./staticText.js');
var socketio = require('socket.io');
var user = require('./user.js');

var io;
var guestNumber = 0;
var namesUsed = []; //使用的名字
var nickNames = {};  //socketID 关联用户名
var currentRoom = {};  //socketID 关联房间号

function socketServer(httpServer) {

    io = socketio.listen(httpServer);
    io.set('log level', 1);
    io.sockets.on('connection', function (socket) {

        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);  //分配一个流水名字并返回 计数器

        console.log('共连接次数:', guestNumber);
        joinRoom(socket, STATIC_TEXT.LOBBY);

        handleMessageBroadcasting(socket, nickNames);       //处理用户消息
        handleNameChangeAttempts(socket, nickNames, namesUsed);  //处理用户更名
        handleRoomJoining(socket); //处理用户创建和变更聊天室

        socket.on(STATIC_TEXT.ROOMS, function () {   //用户发出请求时，向其提供已经被占用的聊天室列表
            console.log('发送房间列表');
            socket.emit(STATIC_TEXT.ROOMS, io.of('/').adapter.rooms); //获取所有房间（分组）信息
        });

        handleCilentDisconnection(socket, nickNames, namesUsed); //用户断开连接后的逻辑
    });

}

/**
 * 分配用户昵称并处理逻辑
 * @param {*} socket 
 * @param {*} guestNumber 
 * @param {*} nickNames 
 * @param {*} namesUsed 
 */
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    var name = '无名氏(' + (guestNumber + 1) + ')';  //新昵称
    nickNames[socket.id] = name; //用户昵称关联ID

    console.log('改名成功并发送:', name);
    socket.emit(STATIC_TEXT.NAME_RESULT, {  //让用户知道他们的昵称
        success: true,
        name: name
    });

    namesUsed.push(name);  //存放已经使用的昵称
    return guestNumber + 1;  //计数器+1

}

/**
 * 进入聊天室相关的逻辑
 * 1 进入了新的房间是否成功
 * 2 让房间里的所有人知道有人进入房间
 * @param {*} socket 
 * @param {*} room 
 */
function joinRoom(socket, room) {
    socket.join(room);     //让用户进入房间

    currentRoom[socket.id] = room;

    socket.emit(STATIC_TEXT.JOIN_RESULT, { room: room }); //进入了新的房间是否成功
    socket.broadcast.to(room).emit(STATIC_TEXT.MESSAGE, {  //让房间里的所有人知道有人进入房间
        text: nickNames[socket.id] + ' 加入了 ' + room + '.'
    });

    console.log(room);

    var usersInRoom = io && io.of('/').adapter.rooms[room]; //有多少用户在房间
    if (usersInRoom.length >= 1) {
        console.log('目前房间 ' + room + '人数有: ' + usersInRoom.length);
        var usersInRoomSummary = '';

        usersInRoom = Object.keys(usersInRoom.sockets);
        for (var index in usersInRoom) {
            var userSocketId = usersInRoom[index];

            if (index > 0) {
                usersInRoomSummary += ',';
            }
            usersInRoomSummary += nickNames[userSocketId];
        }
        console.log(usersInRoomSummary);
        io.sockets.in(room).emit(STATIC_TEXT.ROOM_MENBER, { text: usersInRoomSummary }); //汇总该房间里的其它成员名称发送给给该用户
    }
}


/**
 * 处理改名字
 * 1 判断不能使用默认名字
 * 2 注册新名
 * 3 名字加入存放namesUsed
 * 4 关联socket.id
 * 5 删除，但不改变长度，注意
 * 6 通知当前用户更名成功信息
 * 7 房间中其他用户知悉当前用户已更名
 * @param {*} socket 
 * @param {*} nickNames 
 * @param {*} namesUsed 
 */
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    socket.on(STATIC_TEXT.NAME_ATTEMPT, function (name) {
        if (name.indexOf('无名氏') == 0) {       //不能以Guest开头
            socket.emit(STATIC_TEXT.NAME_RESULT, {
                success: false,
                message: '名字不能使用 "无名氏" .'
            });
        } else {//注册用户名称
            if (namesUsed.indexOf(name) == -1) {
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name; // 关联socket.id

                delete namesUsed[previousNameIndex]; //删除，但不改变长度，注意

                socket.emit(STATIC_TEXT.NAME_RESULT, { //通知当前用户更名信息
                    success: true,
                    name: name
                });

                socket.broadcast.to(currentRoom[socket.id]).emit(STATIC_TEXT.MESSAGE, {//房间中其他用户知悉当前用户已更名
                    text: previousName + ' 改名为 ' + name + '.'
                });

            } else {//该昵称已经存在

                socket.emit(STATIC_TEXT.NAME_RESULT, {
                    success: false,
                    message: '这个名字已经有人使用了'
                });
            }
        }
    });
}

/**
 * 某人发送消息
 * @param {*} socket 
 */
function handleMessageBroadcasting(socket) {
    socket.on(STATIC_TEXT.MESSAGE, function (message) {
        var room = currentRoom[socket.id];
        console.log(room + ' ' + nickNames[socket.id] + ': ' + message.text);
        socket.broadcast.to(room).emit(STATIC_TEXT.MESSAGE, { text: nickNames[socket.id] + ': ' + message.text });
    })
}

/**
 * 创建房间
 * 1 离开频道
 * 2 加入其他频道
 * @param {*} socket 
 */
function handleRoomJoining(socket) {
    socket.on(STATIC_TEXT.JOIN, function (room) {
        socket.leave(currentRoom[socket.id]); //离开频道
        joinRoom(socket, room.newRoom);
    })
}


/**
 * 断开连接
 * 1 删除使用的名字
 * 2 删除socketID 关联用户名
 * @param {*} socket 
 */
function handleCilentDisconnection(socket) {
    socket.on(STATIC_TEXT.DISCONNET, function () {
        var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex]; //删除使用的名字
        delete nickNames[socket.id]; //删除socketID 关联用户名
    })
}





exports.listen = socketServer;