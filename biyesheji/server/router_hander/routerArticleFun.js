//导入配置好的数据库模块
const db = require('../sqldb/db');

//获取当前菜谱内容
const getArticleContainer = (req,res)=>{
    //获取要查询的内容
    let mainId = req.query.name;
    //定义查询语句
    let queryGetContainer = 'SELECT * FROM recipearitice WHERE main_id = ?';
    db.query(queryGetContainer,mainId,(err,results)=>{
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

//获取菜谱的步骤
const getArticleSteps = (req,res)=>{
    //定义查询语句
    let querySteps = 'SELECT * FROM recipesetps WHERE main_id = ?';
    db.query(querySteps,req.query.mainId,(err,results)=>{
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

//增加点击量
const setArticleBrowse = (req,res)=>{
    //数据库查询语句
    let querySetBrowse = 'UPDATE recipearitice SET browse=browse+1 WHERE main_id =?';
    db.query(querySetBrowse,req.body.Browse,(err,results)=>{
        if(err){
            return res.send({
                status:0,
                message:'查询数据库失败！'
            })
        }
        if(results.affectedRows ===1){
            console.log('访问量加1');
            return res.send({
                status:1,
                message:'修改数据成功！'
            });
        }
    })
}

//暴露接口
module.exports = {
    getArticleContainer,
    getArticleSteps,
    setArticleBrowse,
}