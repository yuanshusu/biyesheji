$(function(){
    //验证token，并且显示用户名
    tokenDete()

    //封装函数
    function tokenDete() {
        token = window.localStorage.getItem('tokenRoot');
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
                        window.location.reload();
                    }
                    if (data) {
                        //存在数据，显示用户名
                        $('#dropdownMenu2').find('span').text(data.username);
                    }
                },
                error: function (err) {
                    console.log('当前网络错误！');
                }
            });
        } else {
            //当前没有登录，显示登录框
            alert('用户非法进入：请离开！');
            window.location.href = '../../pageWeb/NotFound404.html';
        }
    }
    //点击退出，删除token
    $('.dropdown-item').on('click',function(){
        window.localStorage.removeItem('tokenRoot');
        alert('退出成功！');
    })

    //开始就显示用户列表
    $('.sub-menu').first().find('a').trigger("click");
})