//导入配置好的数据库模块
const db = require('../sqldb/db');

//查询token中的信息
const getTokenInfo = (req,res)=>{
    let name = req.user.name;
    let id = req.user.id;
    let queryToken = 'SELECT * FROM userinfo WHERE name=? AND id=?';
    db.query(queryToken,[name,id],(err,results)=>{
        if(err){
            return res.send('数据库出错！'+err.message);
        }
        if(results == ''){
            return res.send({
                status:0,
                message:'用户不存或已删除'
            });
        }
        //向客户端传递用户信息
        return res.send(results[0]);
    })
}


//暴露接口
module.exports = {
    getTokenInfo,
}