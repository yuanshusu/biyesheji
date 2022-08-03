//导入配置好的数据库模块
const db = require('../sqldb/db');

//创建搜索和获取列表的文章
const getArticleList = (req,res)=>{
    let queryList = 'SELECT * FROM article WHERE (article_title LIKE ?) OR article_id =?';
    db.query(queryList,['%'+req.query.title+'%',req.query.title],(err,results)=>{
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

//新增文章内容
const createArticle = (req,res)=>{
    //创建一个数组接收数据
    let arr = {};
    for(let i=0; i< req.body.length;i++){
        let name = req.body[i]['name'];
        let value = req.body[i]['value'];
        arr[name]=value;
    }
    //获取当前的时间
    let newTime = Date.now();
    //定于创建语句
    let queryCreate = 'INSERT INTO article(article_class,article_title,article_titleTwo,article_sort,article_new,original,article) VALUES(?,?,?,?,from_unixtime(?),?,?)';
    db.query(queryCreate,[arr.class,arr.title,arr.titleTwo,arr.sort,newTime,arr.original,arr.article],(err,results)=>{
        if(err){
            return res.send({
                status:0,
                message:'查询数据库失败！'
            })
        }
        if(results.affectedRows ===1){
            return res.send({
                status:1,
                message:'文章新增成功！'
            })
        }
    })
}

//删除文章内容
const delArticle = (req,res)=>{
    console.log(req.body.id);
    let queryDelUser = 'delete from article where article_id= ?';
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

//修改文章内容
const updateArticle = (req,res)=>{
    
    //创建一个数组接收数据
    let dataArr = {};
    for(let i=0; i< req.body.length;i++){
        let name = req.body[i]['name'];
        let value = req.body[i]['value'];
        dataArr[name]=value;
    }
    let queryUpdate = 'update article set article_class=?,article_title=?,article_titleTwo=?,article_sort=?,original=?,article=? where article_id=?';
    db.query(queryUpdate,[dataArr.article_class,dataArr.article_title,dataArr.article_titleTwo,dataArr.article_sort,dataArr.original,dataArr.article,dataArr.article_id],(err,results)=>{
        if(err){
            return res.send({
                status:0,
                message:'查询数据库失败！'
            })
        }
        if(results.affectedRows == 1){
            return res.send({
                status:1,
                message:'修改数据成功！'
            })
        }
    })
}

//暴露接口
module.exports = {
    getArticleList,
    delArticle,
    updateArticle,
    createArticle,
}