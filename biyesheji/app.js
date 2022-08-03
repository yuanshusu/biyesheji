//导入express框架
const express = require('express')
const app = express()
//导入内置路径模块
const path = require('path');
//导入解析token中间件
const expressJWT =require('express-jwt');
//导入挂载的路由模块
const router = require('./server/router/router');
//跨域三方
const cors = require('cors');

//设置服务器的端口
const port = process.env.PORT || 8080

//设置静态资源目录
app.use(express.static(path.join(__dirname,'./server/public')));

//跨域中间件
app.use(cors());

//解析请求体数据
app.use(express.json());

//解析客户端的token字符串
app.use(expressJWT({
    secret:router.secretKey,
    algorithms:['HS256']            //设置算法
}).unless({
    //哪些接口不需要进行token身份认证
    path:[
        //post请求都不需要用户的信息
        {url:/^\/user\//,methods:['POST']},
        {url:/^\/user\//,methods:['GET']},
        {url:/^\/recipe\//,method:['GET']},
        {url:/^\/recipe\//,method:['POST']},
        {url:/^\/article\//,method:['GET']},
        {url:/^\/article\//,method:['POST']},
        {url:/^\/index\//,method:['GET']},
        {url:/^\/health\//,method:['GET']},
        {url:/^\/content\//,method:['GET']},
        {url:/^\/manageUser\//,method:['GET']},
        {url:/^\/comments\//,method:['GET']},
        {url:/^\/articleList\//,method:['GET']},
    ]
}));


//注册路由为全局中间件
app.use(router);


//处理错误的全局中间件
app.use((err,req,res,next)=>{
    console.log('发生了错误：'+err.message);
    if (err.name === 'UnauthorizedError'){
        console.log('Token错误！');
        return res.send({
            status:404,
            message:'身份认证失败！'
        });
    }else{
        return res.send('Error：'+err.message);
    }
    next();
})

app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))