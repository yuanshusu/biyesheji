const router = require('express').Router()

//导入函数模块
const userCommentsFun = require('../router_hander/userCommentsFun');

//挂载函数模块路由
router.get('/getComment',userCommentsFun.getComment);

//删除评论
router.post('/delCommentId',userCommentsFun.delCommentId);

//查询评论
router.get('/updateComment',userCommentsFun.updateComment);

module.exports  = router