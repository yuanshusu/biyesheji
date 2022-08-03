//导入配置好的数据库模块
const db = require('../sqldb/db');
//导入路径模块
const path = require('path');
//导入内置文件模块
const fs = require('fs');
//导入解析二进制文件模块
const formidable = require('formidable');

//创建查询菜谱列表的函数
const getUserRecipeList = (req, res) => {
    let pageNum = parseInt(req.query.page);
    let queryRecipeMain = 'SELECT * FROM recipearitice';
    //查询总的数量
    let dataMainLength = 0;
    db.query(queryRecipeMain, (err, result) => {
        if (err) {
            return res.send({
                status: 0,
                message: '查询数据库失败！'
            })
        }
        dataMainLength = result.length;
        //创建返回分页的数组
        let dataPageArr = [];
        if (pageNum >= Math.ceil(dataMainLength / 10)) {
            dataPageArr = [pageNum - 2, pageNum - 1, pageNum];
        } else if (pageNum == 1) {
            dataPageArr = [pageNum, pageNum + 1, pageNum + 2];
        } else {
            dataPageArr = [pageNum - 1, pageNum, pageNum + 1];
        }
        //创建查询语句，返回条数10条
        let queryRecipe = 'SELECT * FROM recipearitice WHERE main_id between ? and ?';
        db.query(queryRecipe, [(pageNum - 1) * 10 + 1, pageNum * 10], (err, results) => {
            if (err) {
                return res.send({
                    status: 0,
                    message: '查询数据库失败！'
                })
            }
            //转换格式
            let resultsJson = JSON.stringify(results);
            resultsJson = JSON.parse(resultsJson);
            return res.send({
                status: 1,
                message: '查询成功！',
                array: dataPageArr,
                data: resultsJson,
                pageNum: dataMainLength,
                nowPage:pageNum
            });
        })
    })

}

//查询特定的菜谱名称或用户id
const getUserRecipeName = (req,res)=>{
    let val = req.query.textVal;
    let queryGetName = 'SELECT * FROM recipearitice WHERE (title LIKE ?) OR (user_id = ?)'
    db.query(queryGetName,['%'+val+'%',val],(err,results)=>{
        if (err) {
            return res.send({
                status: 0,
                message: '查询数据库失败！'
            })
        }
        let listLength = results.length;
        //转换格式
        let resultsJson = JSON.stringify(results);
        resultsJson = JSON.parse(resultsJson);
        //当分页的数量小于等于1页
        if(listLength<10){
            
            return res.send({
                status:1,
                message:'查询数据成功！',
                array:['1'],
                data:resultsJson,
           })
        }else{
            //设置分页的查询
            return res.send({
                status:1,
                message:'查询数据成功！',
                array:[1,2,3],
                data:resultsJson
            })
        }
    })
}

//删除菜谱信息
const delRecipe = (req,res)=>{
    let queryDelRecipe = 'delete from recipearitice where main_id= ?'
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

//修改菜谱信息
const updateRecipe = (req,res)=>{
    //创建一个数组接收数据
    let dataArr = {};
    for(let i=0; i< req.body.length;i++){
        let name = req.body[i]['name'];
        let value = req.body[i]['value'];
        dataArr[name]=value;
    }
    let queryUpdate = 'update recipearitice set title=?,ingrediendMain=?,skills1=?,skills2= ?,skills3=?,skills4 = ?,mainNumber=?,people=?,ingrediendTwo=?,twoNumber=?,introdace=? where main_id=?';
    db.query(queryUpdate,[dataArr.title,dataArr.ingrediendMain,dataArr.skills1,dataArr.skills2,dataArr.skills3,dataArr.skills4,dataArr.mainNumber,dataArr.people,dataArr.ingrediendTwo,dataArr.twoNumber,dataArr.introdace,dataArr.mainId],(err,results)=>{
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
        
    });
}

//获取上传的图片数据
const upLoadImg = (req,res)=>{
    const form = formidable({
        multiples:true,
        uploadDir:path.join(__dirname,'../public/img','successImg'),  //保存文件的路径
        keepExtensions:true                                         //保留后缀
    });
    form.parse(req,(err,fields,files)=>{
        if(err){
            console.log('图片存储出错');
            return res.send({
                status:0,
                message:'图片上传失败！'
            })
        }
        let oldPath = path.join(__dirname,'../public/img','successImg',files.file.newFilename);
        let newPath = '';
        //查询数据库，然后获取最后一个id名
        let queryLastId = 'SELECT main_id FROM recipearitice ORDER BY main_id DESC LIMIT 1';
        db.query(queryLastId,(err,results)=>{
            if(err){
                return res.send({
                    status:0,
                    message:'查询数据库失败！'
                })
            }
            let imgId =++results[0].main_id;
            newPath = path.join(__dirname,'../public/img','successImg','success'+imgId+'.jpg');
            //修改当前的form表单名称，并返回给客户端
            files.file.newFilename = 'success'+imgId+'.jpg';
            //修改名称
            fs.rename(oldPath,newPath,function(err){
                if(err){
                    console.log('修改失败！'+err);
                }
            })
            return res.send({
                status:1,
                path:'http://localhost:8080/img/successImg/'+files.file.newFilename
            }) 
        });
    })
}

//创建菜谱
const createRecipe = (req,res)=>{
    //创建一个数组接收数据
    let dataArr = {};
    for(let i=0; i< req.body.length;i++){
        let name = req.body[i]['name'];
        let value = req.body[i]['value'];
        dataArr[name]=value;
    }
    console.log(dataArr);
    let queryRecipe = 'INSERT INTO recipearitice(title,coverImg,ingrediendMain,user_id,list_id,skills1,skills2,skills3,skills4,mainNumber,people,ingrediendTwo,twoNumber,introdace,successImg) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(queryRecipe,[dataArr.title,dataArr.coverImg,dataArr.mainFood,dataArr.userId,dataArr.listId,dataArr.skills1,dataArr.skills2,dataArr.skills3,dataArr.skills4,dataArr.mainNumber,dataArr.people,dataArr.ingrediendTwo,dataArr.twoNumber,dataArr.introdace,dataArr.coverImg],(err,results)=>{
        if(err){
            return res.send({
                status:0,
                message:'查询数据库失败！'
            })
        }
        console.log(results);
        if(results.affectedRows == 1){
            return res.send({
                status:1,
                message:'插入数据成功！'
            })
        }
    })
}

//暴露接口
module.exports = {
    getUserRecipeList,
    getUserRecipeName,
    delRecipe,
    updateRecipe,
    upLoadImg,
    createRecipe,
}