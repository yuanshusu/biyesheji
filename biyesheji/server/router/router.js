const router = require('express').Router()

//用于共享多个路由模块

//导入登录路由模块
const routerLogin = require('./routerLogin');
//导入首页路由模块
const routerIndex = require('./routerIndex');
//导入获取菜谱模块
const routerRecipe = require('./routerRecipe');
//导入获取菜谱内容模块
const routerArticle = require('./routerArticle');
//导入获取首页推荐模块
const routerIndexPage = require('./routerIndexPage');
//导入获取文章列表模块
const routerHealth = require('./routerHealth');
//导入发表文章评论模块
const routerContent = require('./routerContent');
//导入查询主页信息列表模块
const userIndex = require('./userIndex');
//导入获取评论列表模块
const userComments = require('./userComments');
//导入获取文章列表模块
const userArticle = require('./userArticle');

//挂载路由
//创建用户路由相关的
router.use('/user',routerLogin);
//验证token用户
router.use('/public',routerIndex);
//获取菜谱
router.use('/recipe',routerRecipe);
//获取菜谱内容
router.use('/article',routerArticle);
//获取推荐内容
router.use('/index',routerIndexPage);
//获取文章列表
router.use('/health',routerHealth);
//发表文章评论内容
router.use('/content',routerContent);
//获取首页相关的内容
router.use('/manageUser',userIndex)
//获取评论列表
router.use('/comments',userComments)
//获取管理文章
router.use('/articleList',userArticle);

//token密钥
router.secretKey = routerLogin.secretKey;
module.exports  = router;