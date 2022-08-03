const router = require('express').Router()

//导入函数模块
const routerIndexPubFun = require('../router_hander/routerIndexPageFun');

//挂载路由
//获取一日三餐的数据
router.get('/getIndexFood',routerIndexPubFun.getIndexFood)

//获取下面模块的数据
router.get('/getIndexModule',routerIndexPubFun.getIndexModule);

module.exports  = router;