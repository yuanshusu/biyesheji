//导入配置好的数据库模块
const { query } = require('express');
const db = require('../sqldb/db');

//查询当前的总列表
const getMainList = (req,res)=>{
    //获取前台传递的值
    let name = req.query.name;
    //定义查询列表语句
    let query = 'SELECT foodname,id FROM recipelist WHERE list_id =(SELECT list_id FROM recipe WHERE name=?)'
    db.query(query,name,(err,results)=>{
        if(err){
            console.log(err.message);
            return res.send('查询出错！'+err.message);
        }
        let resultsJson =JSON.stringify(results);
        resultsJson = JSON.parse(resultsJson);
        res.send(resultsJson);
    })
}

//后端获取菜谱系列表
const getUserMain = (req,res)=>{
    let query = 'SELECT foodname,id FROM recipelist';
    db.query(query,(err,results)=>{
        if(err){
            console.log(err.message);
            return res.send('查询出错！'+err.message);
        }
        let resultsJson =JSON.stringify(results);
        resultsJson = JSON.parse(resultsJson);
        res.send(resultsJson);
    })
}

//查询所有的菜谱
const getRecipeMain = (req,res)=>{
    let listId = req.query.listId;
    let queryMain = '';
    if(req.query.sort == '发布顺序'){
        if(req.query.listId =='main'){
            queryMain = 'SELECT * FROM recipearitice  ORDER BY main_id DESC';
        }else{
            queryMain = 'SELECT * FROM recipearitice  where list_id = ? ORDER BY main_id DESC'
        }
    }else if(req.query.sort == '菜谱名称'){
        if(req.query.listId =='main'){
            queryMain = 'SELECT * FROM recipearitice  ORDER BY CONVERT(title using gbk) ASC';
        }else{
            queryMain = 'SELECT * FROM recipearitice where list_id = ? ORDER BY CONVERT(title using gbk) ASC';
        }
    }else if(req.query.sort == '最多点击'){
        if(req.query.listId =='main'){
            queryMain = 'SELECT * FROM recipearitice  ORDER BY browse DESC';
        }else{
            queryMain = 'SELECT * FROM recipearitice where list_id = ? ORDER BY browse DESC';
        }
    }
    db.query(queryMain,listId,(err,results)=>{
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

//查询当前点击的列表内容
const getRecipeList = (req,res)=>{
    //拿到请求的数据
    let listId = req.params.listId.slice(1);
    //定义查询语句
    let queryList = '';
    if(req.query.sort ==='发布顺序'){
        queryList = 'SELECT * FROM recipearitice  where list_id = ? ORDER BY main_id DESC';
    }else if(req.query.sort ==='菜谱名称'){
        queryList = 'SELECT * FROM recipearitice where list_id = ? ORDER BY CONVERT(title using gbk) ASC';
    }else if(req.query.sort ==='最多点击'){
        queryList = 'SELECT * FROM recipearitice where list_id = ? ORDER BY browse DESC';
    }
    //查询数据库
    db.query(queryList,listId,(err,results)=>{
        if(err){
            console.log('查询失败！');
            return res.send({
                status:0,
                message:'数据库查询失败！'
            })
        }
        //转换格式
        let resultsJson =JSON.stringify(results);
        resultsJson = JSON.parse(resultsJson);
        return res.send(resultsJson);
    })
}


//查询用户头像名称
const getRecipeImg = (req,res)=>{
    let userId = req.query.userId;
    //定义查询语句
    const queryImg = 'SELECT username,headerImg FROM userinfo WHERE id = (SELECT user_id FROM recipearitice WHERE main_id =?)';
    //查询数据
    db.query(queryImg,userId,(err,results)=>{
        if(err){
            console.log('查询失败！');
            return res.send({
                status:0,
                message:'数据库查询失败！'
            })
        }
        //转换格式
        let resultsJson =JSON.stringify(results);
        resultsJson = JSON.parse(resultsJson);
        return res.send(resultsJson);
    })
}

// //定义查询分页数
// const getRecipePage = (req,res)=>{
//     //定义查询当前的总数量
//     let queryPage = 'SELECT main_id FROM recipearitice';
//     db.query(queryPage,(err,results)=>{
//         if(err){
//             console.log('查询失败！');
//             return res.send({
//                 status:0,
//                 message:'数据库查询失败！'
//             })
//         }
//         let pages = Math.ceil(results.length/28);
//         return res.send(pages)
//     })
// }

//暴露接口
module.exports = {
    getMainList,
    getRecipeList,
    getRecipeMain,
    getRecipeImg,
    getUserMain,
    // getRecipePage,
}