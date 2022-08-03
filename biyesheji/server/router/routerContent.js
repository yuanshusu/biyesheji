const router = require('express').Router()

//导入函数模块
const routerContentFun = require('../router_hander/routerContentFun');

//挂载函数
//发表评论
router.post('/setComments',routerContentFun.setComments);

//请求评论
router.get('/getComments',routerContentFun.getComments);

//评论用户信息
router.get('/getUserInfos',routerContentFun.getUserInfos);

module.exports  = router