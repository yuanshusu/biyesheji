//导入三方的sql数据库
const mysql = require('mysql');

//建立连接池
const db = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'root',
    database:'sias2020',
})

//对外暴露接口
module.exports = db;