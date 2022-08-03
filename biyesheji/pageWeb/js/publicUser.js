$(function () {
    let token = window.localStorage.getItem('token');

    //使用函数
    tokenDete();

    //点击退出用户
    $('.index_userItem').on('click', 'li a', function () {
        //当点击了退出登录的按钮
        if ($(this).text() === '退出登录') {
            if (token) {
                //移除当前的token
                window.localStorage.removeItem('token');
                window.location.reload();
                //登录框显示
                tokenDete();
            }else{
                alert('显示出错！请重新刷新页面');
            }
        }
    })
    //封装函数
    function tokenDete() {
        token = window.localStorage.getItem('token');
        if (token) {
            //发送Ajax查看当前的用户是否合法
            $.ajax({
                beforeSend: function (request) {
                    request.setRequestHeader('Authorization', 'Bearer ' + token);
                },
                type: "GET",
                url: "http://localhost:8080/public/getTokenInfo",
                success: function (data) {
                    if (data.status == 0) {
                        //当前token不正确，移除当前存储的token
                        window.localStorage.removeItem('token');
                    }
                    if (data) {
                        //存在数据，显示用户框
                        $('.index_user ul').css('display', 'none');
                        $('.index_user .index_user_headr').css('display', 'block');
                        $('.userMe_user').text(data.username);
                        $('.img_user').attr('src', data.headerImg);
                    }
                },
                error: function (err) {
                    console.log('当前网络错误！');
                    $('.index_user ul').css('display', 'block');
                    $('.index_user .index_user_headr').css('display', 'none');
                }
            });
        } else {
            //当前没有登录，显示登录框
            $('.index_user ul').css('display', 'block');
            $('.index_user .index_user_headr').css('display', 'none');
        }
    }
})