$(function () {
    //进入页面前判断当前是否登录了用户，对token进行判断
    (function(){
        let token = window.localStorage.getItem('token');
        if(token){
            $.ajax({
                beforeSend:function(request){
                    request.setRequestHeader('Authorization','Bearer '+token);
               },
               type: "GET",
               url: "http://localhost:8080/public/getTokenInfo",
               success: function (data) {
                   if(data.status == 404){
                       //当前token不正确，移除当前存储的token
                       window.localStorage.removeItem('token');
                   }else{
                    window.location.href = 'NotFound404.html';
                   }
               },
               error:function(err){
                    console.log('当前端口失效！');
               }
           });
        }
    })()
    let time = 60;      //定时器
    let regphone = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    let userKey = 0;    //检测用户邮箱是否存在
    let passKey = 0;    //检测密码是否合格
    let clickKey =0;    //点击验证码是不是正确
    $('#logon_on_click').on('click', function () {
        $('.login_on').slideUp(500, function () {      //让登录框隐藏
        });
        $('.login_in').css('z-index', 2);
        $('.login_in').slideDown(500, function () {    //让注册框出现
        });
    });
    $('#login_in_click').on('click', function () {

        $('.login_in').slideUp(500, function () {
            $(this).css('z-index', 0);
        });
        $('.login_on').slideDown(500, function () {
        });
    });
    if (location.search === '?value=zhuche') {
        $('.login_in').css({
            display: 'block',
            "z-index": 2
        })
        $('.login_on').css({
            display: 'none',
        })
    }
    //事件监控
    $('#logon_user,#logon_pass,#login_user,#login_pass,#login_pins').on('focus', function () {
        $(this).parent().next().slideUp(500, function () { });
    });
    //注册邮箱号检查
    $('#login_user').on('blur', function () {
        if ($(this).val() == "") {
            $(this).parent().next().slideDown(500, function () { });
            $(this).parent().next().find('p').text('请输入邮箱！');
            userKey = 0;
        } else if (!regphone.test($(this).val())) {
            $(this).parent().next().css('display', 'block');
            $(this).parent().next().find('p').text('请输入正确的邮箱！');
            userKey = 0;
        }else if($(this).val()){
            //使用ajax向服务器查询是否注册
            $.ajax({
                type:'GET',
                url:'http://localhost:8080/user/getEmail?emails='+$(this).val(),
                success:function(data){
                    if(data.result == 0){
                        $('#login_user').parent().next().css('display', 'block');
                        $('#login_user').parent().next().find('p').text('该邮箱已注册，请登录！');
                        userKey = 0;
                    }else{
                        userKey = 1;
                    }
                },
                error:function(err){
                    alert('网络错误');
                }
            })
        }
    });
    //登录事件的邮箱
    $('#logon_user').on('blur', function () {
        if ($(this).val() == "") {
            $(this).parent().next().slideDown(500, function () { });
            $(this).parent().next().find('p').text('请输入邮箱！');
        } else if (!regphone.test($(this).val())) {
            $(this).parent().next().css('display', 'block');
            $(this).parent().next().find('p').text('请输入正确的邮箱！');
        }
    });
    $('#logon_pass').on('blur', function () {
        if ($(this).val() == "") {
            $(this).parent().next().slideDown(500, function () { });
            $(this).parent().next().find('p').text('请输入用户密码！');
        }
    });

    //登录事件，点击登录成功跳转首页
    $('#login_on_submit').on('click',function(){
        if($('#logon_user').val() && $('#logon_pass').val()){
            //Ajax请求
            let inLogData = JSON.stringify({
                name:$('#logon_user').val(),
                password:$('#logon_pass').val(),
            });
            $.ajax({
                type: "POST",
                url: "http://localhost:8080/user/inLogin",
                data: inLogData,
                contentType:'application/json',
                success: function (data) {
                    if(data.status){
                        alert('登录成功！');
                        window.localStorage.setItem('token',data.token);
                        window.setTimeout(function(){
                            window.location.href = 'index.html';
                        },500)
                    }else{
                        alert('用户不存在或密码错误！');
                    }
                },
                error:function(err){
                    alert('网络出错,请稍后再试！');
                }
            });
        }
    })

    //注册框中密码事件
    $('#login_pass').on('blur', function () {
        if ($(this).val() == "") {
            $(this).parent().next().slideDown(500, function () { });
            $(this).parent().next().find('p').text('请设置用户密码！');
            passKey = 0;
        }else if($(this).val().length<6){
            $(this).parent().next().slideDown(500, function () { });
            $(this).parent().next().find('p').text('密码长度小于6位！');
            passKey = 0;
        }else{
            passKey = 1;
        }
    });

    //发送邮箱验证码
    $('.logon_sendPin').on('click', function () {
        if(userKey){
            let _this = this;
            $('.logpin_cover').css('display', 'block');
        }else if(userKey ==0){
            alert('邮箱格式不正确！');
        }else{
            alert('网络出现错误！');
        }
        
    })
    //调用验证框
    $('#mpanel5').pointsVerify({
        defaultNum: 4,	//默认的文字数量
        checkNum: 2,	//校对的文字数量
        vSpace: 1,	//间隔
        imgName: ['1.jpg', '2.jpg'],
        imgSize: {
            width: '600px',
            height: '200px',
        },
        barSize: {
            width: '600px',
            height: '40px',
        },
        ready: function () {
        },
        success: function () {
            setTimeout(function(){
                $('.logpin_cover').css('display', 'none');
            },200);
            $('.logon_sendPin').attr('disabled', "true");
            $('.logon_sendPin').text(time + 's后重新发送');
            clickKey =1;
            // 判断是否点击正确
            if(clickKey == 1){
                //发送ajax请求
                $.ajax({
                    type:'GET',
                    url:'http://localhost:8080/user/getEmailPin?emails='+$('#login_user').val(),
                    success:function(data){
                        console.log('发送成功！');
                    }
                })
            }
            let timeOuts = setInterval(function () {
                if (time > 0) {
                    time--;
                    $('.logon_sendPin').text(time + 's后重新发送');
                } else {
                    clearInterval(timeOuts);
                    time = 60;
                    $('.logon_sendPin').removeAttr("disabled");
                    $('.logon_sendPin').text('重新发送');
                };
            }, 1000);

            $('.verify-refresh').trigger("click");
        },
        error: function () {
            clickKey =0;
        }
    });

    //点击外面关闭
    $('.logpin_cover').on('click', function () {
        $(this).css('display', 'none');
    })
    $('.logPin_pin').on('click', function (e) {
        e.stopPropagation();
    })

    //注册提交事件
    $('#login_registered').on('click',function(){
        if(userKey && passKey){
           //发送Ajax请求验证表单
           let formDatas = JSON.stringify({
                name:$('#login_user').val(),
                password:$('#login_pass').val(),
                pin:$('#login_pins').val()
            })
           $.ajax({
               type:'POST',
               url:'http://localhost:8080/user/saveUser',
               contentType:'application/json',
               data:formDatas,
               async:false,
               success:function(data){
                    if(data.status == 1){
                        alert('创建用户成功！');
                        setTimeout(function(){
                            window.location.reload(true);
                        },500);
                    }else{
                        alert(data.message);
                        setTimeout(function(){
                            window.location.reload();
                        },500);
                    }
               },
               error:function(err){
                   alert('网络错误！');
               }
           })
        }else{
            alert('请填写完整的表单后在提交！');
        } 
    })
    //返回上级网页
    $('#logon_backWeb').on('click',function(){
        history.back();
        return false;
    })
})
