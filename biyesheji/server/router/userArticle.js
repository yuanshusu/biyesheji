const router = require('express').Router()


//导入模块函数
const  userArticleFun = require('../router_hander/userArticleFun');

//挂载路由
router.get('/getArticleList',userArticleFun.getArticleList);

//新增文章
router.post('/createArticle',userArticleFun.createArticle)

//修改文章
router.post('/updateArticle',userArticleFun.updateArticle);

//删除文章
router.post('/delArticle',userArticleFun.delArticle)

module.exports  = router