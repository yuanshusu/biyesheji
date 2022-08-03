const router = require('express').Router()


//导入函数模块
const routerHealthFun = require('../router_hander/routerHealthFun');

//挂载路由
//请求文章列表的接口
router.get('/getArticleList',routerHealthFun.getArticleList)

//查询评论数量接口
router.get('/getComments',routerHealthFun.getComments);

//请求文章的内容接口
router.get('/getContainer',routerHealthFun.getContainer);

module.exports  = router