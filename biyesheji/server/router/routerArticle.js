const router = require('express').Router()

//导入模块函数
const routerArticleFun = require('../router_hander/routerArticleFun');

//挂载路由
//获取菜谱内容
router.get('/getArticleContainer',routerArticleFun.getArticleContainer);

//获取菜谱内容的步骤
router.get('/getArticleSteps',routerArticleFun.getArticleSteps);

//设置当前菜谱的点击量增加
router.post('/setArticleBrowse',routerArticleFun.setArticleBrowse);

module.exports  = router;