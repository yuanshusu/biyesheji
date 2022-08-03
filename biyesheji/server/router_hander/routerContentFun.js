//导入配置好的数据库模块
const db = require('../sqldb/db');

//定义发表评论函数
const setComments = (req,res)=>{
    //用户id存入
    let userId = req.user.id;
    //用户的评论内容
    let comContent = req.body.comment;
    //用户评论的文章id
    let articleId=  req.body.articleId.split('=')[1];
    //获取当前时间搓
    let newTime = Date.now();
    //定于数据库语句
    let querySetComments = 'insert into comments(com_content,com_data,user_id,article_id) values(?,from_unixtime(?),?,?)';
    db.query(querySetComments,[comContent,newTime,userId,articleId],(err,results)=>{
        if(err) return res.send({
            status:0,
            message:'查询数据库出错！'
        });
        if(results.affectedRows ===1){
            res.send({
                status:1,
                message:'插入数据成功!'
            });
        }
    })
}

//定义请求评论的函数
const getComments = (req,res)=>{
    let articleId = req.query.articleId;
    //定义语句
    let queryGet = 'SELECT * FROM comments WHERE article_id =? ORDER BY com_data DESC';
    db.query(queryGet,articleId,(err,results)=>{
        if(err) return res.send({
            status:0,
            message:'查询数据库出错！'
        })
        let resultsJson =JSON.stringify(results);
        resultsJson = JSON.parse(resultsJson);
        res.send(resultsJson);
    });
}

//定义获取评论人的用户信息
const getUserInfos = (req,res)=>{
    //定义语句
    let queryUser = 'SELECT * FROM userinfo WHERE id=?'
    db.query(queryUser,req.query.userId,(err,results)=>{
        if(err) return res.send({
            status:0,
            message:'查询数据库出错！'
        })
        let resultsJson =JSON.stringify(results);
        resultsJson = JSON.parse(resultsJson);
        res.send(resultsJson);
    });
}

//暴露接口
module.exports = {
    setComments,
    getComments,
    getUserInfos,
}