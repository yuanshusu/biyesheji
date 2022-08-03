//导入配置好的数据库模块
const { query } = require('express');
const db = require('../sqldb/db');

//一日三餐的推荐模块
const getIndexFood = (req,res) =>{
    //定义插叙语句
    let queryFood = 'SELECT * FROM indexfood WHERE list_id =? LIMIT 0, 3';
    db.query(queryFood,req.query.listId,(err,results)=>{
        if(err) return res.send({
            status:0,
            message:'查询数据库出错！'
        })
        //转换格式
        let resultsJson =JSON.stringify(results);
        resultsJson = JSON.parse(resultsJson);
        return res.send(resultsJson);
    })
}

const getIndexModule = (req,res)=>{
    let getData = req.query.getData;
    //定义数据库语句
    let queryGetModule = '';
    //判断不同请求的语句也不同
    if(getData ==='new'){
        queryGetModule = 'SELECT * FROM recipearitice ORDER BY main_id DESC LIMIT 0, 5;';
    }else if(getData ==='listId'){
        queryGetModule = 'SELECT * FROM recipearitice WHERE list_id BETWEEN 26 AND 39 ORDER BY main_id DESC LIMIT 0, 5;';
    }else if(getData ==='roushi'){
        queryGetModule = 'SELECT * FROM recipearitice WHERE list_id=5 ORDER BY browse DESC LIMIT 0, 5;';
    }else if(getData ==='health'){
        queryGetModule = 'SELECT * FROM recipearitice WHERE list_id= 3 OR list_id=4 ORDER BY main_id DESC LIMIT 0, 5;';
    }else if(getData ==='baking'){
        queryGetModule = 'SELECT * FROM recipearitice WHERE list_id = 10 OR list_id= 30 ORDER BY main_id DESC LIMIT 0, 5;';
    }
    db.query(queryGetModule,(err,results)=>{
        if(err) return res.send({
            status:0,
            message:'查询数据库出错！'
        })
        //转换格式
        let resultsJson =JSON.stringify(results);
        resultsJson = JSON.parse(resultsJson);
        return res.send(resultsJson);
    })
}

//暴露接口
module.exports = {
    getIndexFood,
    getIndexModule
}