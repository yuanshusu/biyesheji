//导入配置好的数据库模块
const db = require('../sqldb/db');

//创建查询用户列表函数
const getUserList = (req,res)=>{
    let querySelet = 'SELECT * FROM userinfo WHERE id= ? OR name= ?';
    db.query(querySelet,[req.query.name,req.query.name],(err,results)=>{
        if(err || results[0] == null){
            return res.send({
                status:0,
                message:'查询数据库失败！'
            })
        }
        //转换格式
        let resultsJson =JSON.stringify(results);
        resultsJson = JSON.parse(resultsJson);
        return res.send(resultsJson);
    })
}

//查询所有的用户
const getUserMain = (req,res)=>{
    db.query('SELECT * FROM userinfo',(err,results)=>{
        if(err){
            return res.send({
                status:0,
                message:'查询数据库失败！'
            })
        }
        //转换格式
        let resultsJson =JSON.stringify(results);
        resultsJson = JSON.parse(resultsJson);
        return res.send(resultsJson);
    })
}

//删除用户
const delUser = (req,res) =>{
    let queryDelUser = 'delete from userinfo where id= ?';
    db.query(queryDelUser,req.body.id,(err,results)=>{
        if(err){
            return res.send({
                status:0,
                message:'查询数据库失败！'
            })
        }
        if(results.affectedRows ===1){
            return res.send({
                status:1,
                message:'用户删除成功！'
            })
        }
    })
}

//修改用户信息
const updateUser = (req,res)=>{
    let username = req.body.username;
    let userRoot = req.body.userRoot;
    let id = req.body.userId.slice(4);
    let queryUpdate = 'update userinfo set username = ? , root = ? WHERE id= ?'
    db.query(queryUpdate,[username,userRoot,id],(err,results)=>{
        if(err){
            return res.send({
                status:0,
                message:'查询数据库失败！'
            })
        }
        if(results.affectedRows ===1){
            return res.send({
                status:1,
                message:'用户删除成功！'
            })
        }
    })
}

//暴露接口
module.exports = {
    getUserList,
    getUserMain,
    delUser,
    updateUser
}