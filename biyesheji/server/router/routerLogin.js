//创建路由实例
const router = require('express').Router()

//导入多个函数模块
const routerHander = require('../router_hander/routerLoginFun');

//挂载路由
//测试路由
router.get('/' , routerHander.test);

//获取邮箱是否存在数据库
router.get('/getEmail' , routerHander.getEmail)

//发送验证码
router.get('/getEmailPin',routerHander.getEmailPin);

//发送找回密码验证码
router.get('/findEmailPin',routerHander.getEmailPin);

//存储创建用户
router.post('/saveUser',routerHander.saveUser);

//找回密码，修改密码
router.post('/setPassword',routerHander.setPassword);

//登录操作，发送token
router.post('/inLogin',routerHander.inLogin);

router.secretKey  = routerHander.secretKey;
module.exports  = router;