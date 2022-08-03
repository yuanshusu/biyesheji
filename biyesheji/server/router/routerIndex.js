const router = require('express').Router()

//导入路由函数
const routerIndexPubFun = require('../router_hander/routerIndexPubFun'); 

//挂载路由
//请求token信息
router.get('/getTokenInfo',routerIndexPubFun.getTokenInfo);

module.exports  = router