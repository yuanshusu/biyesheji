const router = require('express').Router()

//导入路由函数
const routerRecipeFun = require('../router_hander/routerRecipeFun');

//挂载路由
//获取查询当前的总列表
router.get('/getMainList',routerRecipeFun.getMainList);

//获取分类下的菜谱
router.get('/getRecipeList:listId',routerRecipeFun.getRecipeList);

//查询所有系的菜谱
router.get('/getUserMain',routerRecipeFun.getUserMain)

//获取所有的菜谱
router.get('/getRecipeMain',routerRecipeFun.getRecipeMain);

//获取菜谱的用户头像名称
router.get('/getRecipeImg',routerRecipeFun.getRecipeImg);

//获取分页页数
// router.get('/getRecipePage',routerRecipeFun.getRecipePage)

module.exports  = router