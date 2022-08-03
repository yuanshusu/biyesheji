//导入配置好的数据库模块
const db = require('../sqldb/db');

//创建查询评论的函数
const getComment = (req,res)=>{
    let queryMain = 'SELECT * FROM comments';
    db.query(queryMain,(err,results)=>{
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
    });
}

//删除用户评论的函数
const delCommentId = (req,res)=>{
    let queryDelRecipe = 'delete from comments where com_id= ?'
    db.query(queryDelRecipe,req.body.id,(err,results)=>{
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

//模糊查询评论
const updateComment = (req,res)=>{
    let val = req.query.textVal;
    let queryGetName = 'SELECT * FROM comments WHERE (com_content LIKE ?)'
    db.query(queryGetName,'%'+val+'%',(err,results)=>{
        if (err) {
            return res.send({
                status: 0,
                message: '查询数据库失败！'
            })
        }
        //转换格式
        let resultsJson = JSON.stringify(results);
        resultsJson = JSON.parse(resultsJson);
        return res.send(resultsJson);
    })
}

//暴露接口
module.exports = {
    getComment,
    delCommentId,
    updateComment
}