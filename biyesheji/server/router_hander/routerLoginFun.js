var pin = 0;            //校验验证码
var secretKey = 'I and You to Love';//定义一个secret密钥
//导入配置好的数据库模块
const db = require('../sqldb/db');
//导入发送邮箱三方模块
const nodemailer = require('nodemailer');
//导入加密密码三方模块
const bcrypt = require('bcrypt');
const parse = require('nodemon/lib/cli/parse');
//导入加密token包
const jwt = require('jsonwebtoken');

//用户名自增
let usernameId = 0; 
const queryNameId = 'select username from userInfo where id =(select max(id) from userInfo)';
//查询当前最后一个用户名
db.query(queryNameId,(err,results)=>{
    if(err){
        return console.log('数据库出错！');
    }
    //赋值
    usernameId = parseInt(results[0].username.slice(4))+1;
})
 

//测试函数
const test = (req, res) => {
    //解析的token表单中的信息
    console.log(req.user);
    //定义测试查询语句
    const testQuery = 'select * from userInfo';
    db.query(testQuery, (err, results) => {
        if (err) {
            return res.send(err.message);
        }
        res.send(results);
    });
}

//查询用户名是否注册了
const getEmail = (req,res)=>{
    let queryStr = 'select name from userInfo where name = ?';
    db.query(queryStr,req.query.emails,(err,results)=>{
        if(results[0] == null){
            //该用户没注册
            return res.send({
                result:1
            });
        }
        //用户注册了
        res.send({
            result:0
        });
    })
}

//发送验证码函数
const getEmailPin = (req, res) => {
    //创建随机的验证码
    let code = Math.floor(Math.random() * 900000) + 100000;
    //建立一个smtp连接
    let transporter = nodemailer.createTransport({
        host: "smtp.163.com",     //邮箱的地址
        secureConnection: true,   //
        port: 465,               //端口号
        auth: {
            user: "wjh2935312144@163.com",
            pass: "PKZINSEVNCSJPRJL",
        }
    });

    //配置相关参数
    let options = {
        from: "wjh2935312144@163.com",                       //发件人
        to: "wjh2935312144@163.com," + req.query.emails,     //收件人
        subject: "验证码",                                   //邮件主题
        html: `<head>
        <base target="_blank" />
        <style type="text/css">::-webkit-scrollbar{ display: none; }</style>
        <style id="cloudAttachStyle" type="text/css">#divNeteaseBigAttach, #divNeteaseBigAttach_bak{display:none;}</style>
        <style id="blockquoteStyle" type="text/css">blockquote{display:none;}</style>
        <style type="text/css">
            body{font-size:14px;font-family:arial,verdana,sans-serif;line-height:1.666;padding:0;margin:0;overflow:auto;white-space:normal;word-wrap:break-word;min-height:100px}
            td, input, button, select, body{font-family:Helvetica, 'Microsoft Yahei', verdana}
            pre {white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;width:95%}
            th,td{font-family:arial,verdana,sans-serif;line-height:1.666}
            img{ border:0}
            header,footer,section,aside,article,nav,hgroup,figure,figcaption{display:block}
            blockquote{margin-right:0px}
        </style>
    	</head>
    <body tabindex="0" role="listitem">
    <table width="700" border="0" align="center" cellspacing="0" style="width:700px;">
        <tbody>
        <tr>
            <td>
                <div style="width:700px;margin:0 auto;border-bottom:1px solid #ccc;margin-bottom:30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="700" height="39" style="font:12px Tahoma, Arial, 宋体;">
                        <tbody><tr><td width="210"></td></tr></tbody>
                    </table>
                </div>
                <div style="width:680px;padding:0 10px;margin:0 auto;">
                    <div style="line-height:1.5;font-size:14px;margin-bottom:25px;color:#4d4d4d;">
                        <strong style="display:block;margin-bottom:15px;">尊敬的用户：<span style="color:#f60;font-size: 16px;"></span>您好！</strong>
                        <strong style="display:block;margin-bottom:15px;">
                            您正在进行<span style="color: red">${req.query.info?'找回密码':'注册账号'}</span>操作，请在验证码输入框中输入：<span style="color:#f60;font-size: 24px">${code}</span>，以完成操作。
                        </strong>
                    </div>
                    <div style="margin-bottom:30px;">
                        <small style="display:block;margin-bottom:20px;font-size:12px;">
                            <p style="color:#747474;">
                                注意：此操作可能会修改您的密码、登录邮箱或绑定手机。如非本人操作，请及时登录并修改密码以保证帐户安全
                                <br>（工作人员不会向你索取此验证码，请勿泄漏！)
                            </p>
                        </small>
                    </div>
                </div>
                <div style="width:700px;margin:0 auto;">
                    <div style="padding:10px 10px 0;border-top:1px solid #ccc;color:#747474;margin-bottom:20px;line-height:1.3em;font-size:12px;">
                        <p>此为系统邮件，请勿回复<br>
                            请保管好您的邮箱，避免账号被他人盗用
                        </p>
                        <p>郑州西亚斯学院软件工程2班</p>
                    </div>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
    </body>`,                                               //邮件内容
    }
    //发送邮件
    transporter.sendMail(options, function (err, msg) {
        if (err) {
            console.log(err);
        } else {
            //发送邮件成功！
            pin = code;
            res.send(msg);
            transporter.close();
        }
    })

}

//创建用户函数
const saveUser = (req,res)=>{
    let pagePin = req.body.pin;
    //前后端验证码相同则进行创建用户操作
    if(pagePin == pin){
        let name = req.body.name;
        let password = req.body.password;
        let userImgStr = ''+usernameId;
        let userImg = 'http://localhost:8080/img/headerImg'+userImgStr.charAt(userImgStr.length-1)+'.jpg';
        //调用加密
        password = bcrypt.hashSync(password,5);
        let queryIn = 'insert into userInfo(name,password,headerImg,username) values(?,?,?,?)';
        db.query(queryIn,[name,password,userImg,'轻食用户'+usernameId++],(err,results)=>{
            if(err){
                return res.send({
                    status:0,
                    message:err.message
                });
            }
            if(results.affectedRows ===1){
                return res.send({
                    status:1,
                    message:'创建用户成功！'
                }); 
            }
        })

    }else{
        res.send({
            status:0,
            message:'验证码错误！'
        })
    }
}

//找回密码，设置密码操作
const setPassword = (req,res)=>{
    let findPin = req.body.pin;
    console.log(findPin);
    console.log(pin);
    //前后端验证码相同则进行创建用户操作
    if(findPin == pin){
        let name = req.body.name;
        let password = req.body.password;
        //调用加密
        password = bcrypt.hashSync(password,5);
        //修改语句
        let querySet = 'update userInfo set password = ? where name=?';
        db.query(querySet,[password,name],(err,results)=>{
            if(err){
                return res.send({
                    status:0,
                    message:err.message
                });
            };
            if(results.affectedRows ===1){
                return res.send({
                    status:1,
                    message:'创建用户成功！'
                }); 
            }
        })
    }else{
        res.send({
            status:0,
            message:'验证码错误！'
        })
    }
}

//登录操作，颁发token签名
const inLogin = (req,res)=>{
    //客户端用户和密码
    let name = req.body.name;
    let password = req.body.password;
    //查询数据库
    let queryInfoUser = 'SELECT * FROM userinfo WHERE name=?'
    db.query(queryInfoUser,name,(err,results)=>{
        if(err){
            return console.log('数据库出错！'+err.message);
        }
        //比对数据库中的密码
        if(results[0] !=null){
            let bcryptPass = bcrypt.compareSync(password,results[0].password);
            if(bcryptPass){
                //定义token字符串，携带id和name
                const tokenStr = jwt.sign(
                    {
                        name:name,
                        id:results[0].id
                    },
                    secretKey,
                    {
                        expiresIn:'168h'
                    }
                )
                return res.send({
                    status:1,
                    message:'登录成功！',
                    root:results[0].root,
                    token:tokenStr
                })
            }else{
                return res.send({
                    status:0,
                    message:'没有查询到信息！'
                })
            }
        }else{
            return res.send({
                status:0,
                message:'输入错误！'
            })
        }
    });
}

//暴露接口
module.exports = {
    //键值同名可以省略键名
    test,
    getEmailPin,
    getEmail,
    saveUser,
    setPassword,
    inLogin,
    secretKey
}