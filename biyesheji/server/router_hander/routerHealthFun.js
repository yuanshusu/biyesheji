//导入配置好的数据库模块
const db = require('../sqldb/db');

//创建请求文章列表的接口
const getArticleList = (req,res)=>{
    let articleClass = req.query.class;
    //定义查询语句
    let queryClass = '';
    if(articleClass == '最新发布'){
        queryClass = 'SELECT * FROM article ORDER BY article_new DESC';
    }else{
        queryClass = 'SELECT * FROM article WHERE article_class = ? ORDER BY article_new DESC';
    }
    //查询数据库
    db.query(queryClass,articleClass,(err,results)=>{
        if(err) return res.send({
            status:0,
            message:'查询数据库出错！'
        })
        //转换格式
        let resultsJson =JSON.stringify(results);
        resultsJson = JSON.parse(resultsJson);
        return res.send(resultsJson);
    });
}

//创建请求文章评论数量的接口
const getComments = (req,res)=>{
    let queryGetCom = 'SELECT * FROM comments WHERE article_id =?';
    db.query(queryGetCom,req.query.articleId,(err,results)=>{
        if(err) return res.send({
            status:0,
            message:'查询数据库出错！'
        })
        let resultsJson =JSON.stringify(results);
        resultsJson = JSON.parse(resultsJson);
        res.send({length:resultsJson.length});
    });
}

//创建请求文章内容的接口
const getContainer = (req,res)=>{
    let articleId = req.query.articleId;
    //定义查询语句
    let queryContainer = 'SELECT * FROM article WHERE article_id =?';
    db.query(queryContainer,articleId,(err,results)=>{
        if(err) return res.send({
            status:0,
            message:'查询数据库出错！'
        })
        let resultsJson =JSON.stringify(results);
        resultsJson = JSON.parse(resultsJson);
        res.send(resultsJson);
    })
}

//暴露接口
module.exports = {
    getArticleList,
    getComments,
    getContainer,
}