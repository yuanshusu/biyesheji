$(function(){
    //计时器
    let time = 60;
    let regphone = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    let userKey = 0;
    //输入框焦点事件
    $('#inputEmail3').on('focus',function(){
        //消失
        $('.form-horizontal').find('p:eq(0)').fadeTo('200',0);
    }).on('blur',function(){
        //显示
        $('.form-horizontal').find('p:eq(0)').fadeTo('200',1);
        if($(this).val() === ''){
            $('.form-horizontal').find('p:eq(0)').removeClass('bg-success').addClass('bg-danger').text('请输入邮箱！');
            userKey = 0;
        }else if(!regphone.test($(this).val())){
            $('.form-horizontal').find('p:eq(0)').removeClass('bg-success').addClass('bg-danger').text('请输入正确的邮箱格式！');
            userKey = 0;
        }else if($(this).val()){
            //发送Ajax请求，查看数据库是否有注册
            $.ajax({
                type: "GET",
                url: "http://localhost:8080/user/getEmail?emails="+$('#inputEmail3').val(),
                success: function (data) {
                    if(!data['result']){
                        $('.form-horizontal').find('p:eq(0)').removeClass('bg-danger').addClass('bg-success').text('邮箱格式正确！');
                        userKey =1;
                    }else{
                        $('.form-horizontal').find('p:eq(0)').removeClass('bg-success').addClass('bg-danger').text('邮箱没有注册，请先注册！');
                        userKey = 0;
                    }
                }
            });
        }else{
            $('.form-horizontal').find('p:eq(0)').removeClass('bg-danger').addClass('bg-success').text('邮箱格式正确！');
            userKey =1
        }
    })
    //密码
    $('#inputPassword3').on('focus',function(){
        //消失
        $('.form-horizontal').find('p:eq(1)').fadeTo('200',0);
        
    }).on('blur',function(){
        //显示
        $('.form-horizontal').find('p:eq(1)').fadeTo('200',1);
        if($(this).val() === ''){
            $('.form-horizontal').find('p:eq(1)').removeClass('bg-success').addClass('bg-danger').text('请输入要设置的密码！');
        }else if($(this).val().length<6){
            $('.form-horizontal').find('p:eq(1)').removeClass('bg-success').addClass('bg-danger').text('设置的密码长度请大于6位！');
        }else{
            $('.form-horizontal').find('p:eq(1)').removeClass('bg-danger').addClass('bg-success').text('！');
        }
    })
    //验证码
    $('.logon_sendPin').on('click',function(){
        if(userKey){
            $('.logon_sendPin').attr('disabled', "true");
            $('.logon_sendPin').text(time + 's后重新发送');
            
            //发送ajax找回验证码
            //必须在参数后面加上info=1来判断当前是找回密码操作
            $.ajax({
                type: "GET",
                url: "http://localhost:8080/user/findEmailPin?emails="+$('#inputEmail3').val()+'&info=1',
                success: function (data) {
                    $('.form-horizontal').find('p:eq(2)').fadeTo('200',1);
                    $('.form-horizontal').find('p:eq(2)').removeClass('bg-danger').addClass('bg-warning').text('验证码已发送,请注意查收！'); 
                },
                error:function(err){
                    alert('网络出错，发送失败！');
                }
            });
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
        }else{
            alert('请输入正确的邮箱！');
        }
    })
    //提交
    $('#password_submit').on('click',function(){
        if(confirm('确认提交吗？')){
            if($('#inputEmail3').val() && $('#inputPassword3').val() && $('#inputText')){
                let formDatas = JSON.stringify({
                    name:$('#inputEmail3').val(),
                    password:$('#inputPassword3').val(),
                    pin:$('#inputText').val()
                });
                //发送json字符串,发送Ajax请求
                $.ajax({
                    type: "POST",
                    url: "http://localhost:8080/user/setPassword",
                    contentType:'application/json',
                    data: formDatas,
                    dataType: "json",
                    success: function (data) {
                        if(data.status){
                            alert('修改密码成功!');
                            setTimeout(function(){
                                window.location.reload(true);
                            },500);
                        }else{
                           alert('验证码输入错误，请重新获取！');
                        }
                    }
                });
            }else{
                $('.form-horizontal').find('p').fadeTo('200',1);
                $('.form-horizontal').find('p:eq(2)').removeClass('bg-warning').addClass('bg-danger').text('请正确填写表单！');
            }
        }
    })
})