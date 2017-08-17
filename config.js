/**
 * 系统配置文件
 */
const path = require('path');
const config = {
    debug: true, // 本地调试模式
    sitename: 'chatrooms', // 名称
    port: 8624, //端口
    // 数据库连接
    mongodb: {
        user: '',
        pass: '',
        host: '127.0.0.1',
        port: 27017,
        database: 'chatrooms'
    },
    // Redis配置
    redis: {
        host: '127.0.0.1',
        port: 6379
    },
    default_avatar: '/public/images/photo.png', // 默认头像
}

module.exports = config;