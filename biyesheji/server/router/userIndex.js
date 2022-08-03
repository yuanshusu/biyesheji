const router = require('express').Router()

//导入查询用户列表
const userIndexFun = require('../router_hander/userIndexFun');
//导入查询菜谱列表
const userRecipeFun = require('../router_hander/userRecipeFun');

//挂载路由
//获取搜索的用户
router.get('/getUserList',userIndexFun.getUserList);

//获取所有用户
router.get('/getUserMain',userIndexFun.getUserMain)

//删除用户
router.post('/delUser',userIndexFun.delUser)

//修改用户
router.post('/updateUser',userIndexFun.updateUser);

//获取菜谱内容
router.get('/getUserRecipeList',userRecipeFun.getUserRecipeList);

//获取搜索的菜谱的信息
router.get('/getUserRecipeName',userRecipeFun.getUserRecipeName);

//修改菜谱的信息
router.post('/updateRecipe',userRecipeFun.updateRecipe);

//删除当前点击的菜谱信息
router.post('/delRecipe',userRecipeFun.delRecipe);

//上传图片
router.post('/upLoadImg',userRecipeFun.upLoadImg);

//新增菜谱
router.post('/createRecipe',userRecipeFun.createRecipe)

module.exports  = router