$(function(){
    //获取地址栏传递的参数信息
    let articleId = window.location.search;
    if(!articleId){
        window.location.href = 'NotFound404.html';
    }
    //发送Ajax请求获取文章内容
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/health/getContainer"+articleId,
        success: function (data) {
            data[0].article_new = data[0].article_new.replace('T',' ');
            data[0].article_new = data[0].article_new.replace('.000Z','');
            $('.content_main_title').text(data[0].article_title);
            $('.content_main_two').find('span').text(data[0].original);
            $('.content_main_two').find('i').text(data[0].article_new);
            $('.content_main_content').html(data[0].article);
        }
    });

    //发送Ajax请求获取评论
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/content/getComments"+articleId,
        success: function (data) {
            //显示当前评论数量
            $('.content_comments_com').find('span').text(data.length);
            //定义拼接的字符串
            let commentHtml = '';
            let userInfo = '';

            for(let i in data){
                data[i].com_data = data[i].com_data.replace('T',' ');
                data[i].com_data = data[i].com_data.replace('.000Z','');
                //发送Ajax请求获取用户信息
                $.ajax({
                    type: "GET",
                    async:false,
                    url: "http://localhost:8080/content/getUserInfos?userId="+data[i].user_id,
                    success: function (datas) {
                        userInfo = datas[0];
                    }
                });
                commentHtml+=`<li class="content_com_listItem">
                <div class="content_com_item">
                    <!-- 头像 -->
                    <a href="javascript:;" class="com_img">
                        <img src="${userInfo.headerImg}" alt="用户">
                    </a>
                    <!-- 名称和内容 -->
                    <div class="com_imgname">
                        <div class="com_username">
                            <a href="javascript:;">${userInfo.username}</a>
                        </div>
                        <div class="com_pinglun">
                            <p>${data[i].com_content}</p>
                        </div>
                        <div class="com_time">
                            <span>${data[i].com_data}</span>
                        </div>
                    </div>
                </div>
                </li>`
            }
            $('.content_com_list').html(commentHtml);
        }
    });

    //获取token是否存在
    let token = window.localStorage.getItem('token');
    if(!token){
        $('.content_com_text,.content_com_but').hide();
        $('.content_com_a').show();
    }else{
        $('.content_com_text,.content_com_but').show();
        $('.content_com_a').hide();
    }

    //发表评论
    let textValue =''; 
    $('#content_com_text').on('focus',function(){
        $(document).on('keyup',function(){
            let textArea = document.querySelector('#content_com_text').value;
		    textArea = textArea.replace(/\s/g, '&nbsp;'); //空格处理
            textValue= textArea;
            if(textValue){
                $('.content_com_but').find('button').removeClass('disbut').removeAttr("disabled");
            }else{
                $('.content_com_but').find('button').addClass('disbut').attr({"disabled":"disabled"});
            }
        });
    }).on('blur',function(){
        // console.log(textValue);
        if(textValue){
            $('.content_com_but').find('button').removeClass('disbut').removeAttr("disabled");
        }else{
            $('.content_com_but').find('button').addClass('disbut').attr({"disabled":"disabled"});
        }
    })

    //发表评论
    $('.content_com_submit').on('click',function(){
        if(textValue.length<5){
            alert('请输入内容大于5个字！');
            return false;
        }
        //发送json字符串
        let comment = JSON.stringify({comment:textValue,articleId});
        //发送Ajax请求
        $.ajax({
            beforeSend: function (request) {
                request.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            type: "POST",
            url: "http://localhost:8080/content/setComments",
            data: comment,
            contentType:'application/json',
            success: function (data) {
                if(data.status == 0){
                    alert('评论失败！请稍后再试！');
                }
                if(data.status == 1){
                    alert('评论已提交！');
                    window.location.reload();
                }
            },
            error:function(err){
                alert('评论失败！')
            }
        });
    })
    

    //底部文字变色
    $('#index_bottomul').on('mouseenter','li',function(){
        $(this).find('a').css('color','rgb(246,77,54)');
    }).on('mouseleave','li',function(){
        $(this).find('a').css('color','#fff');
    });

    //返回顶部
    $('.index_backTop').on('click',function(){
        $('html').animate({
            scrollTop:0
        },500);
    })
    //显示隐藏
    $(window).scroll(function(){
    backTop()
    })
    function backTop(){
        //返回顶部的显示与隐藏
        if($(window).scrollTop()>$('body').height()/2){
            $('.index_backTop').css('display','block');
        }else{
            $('.index_backTop').css('display','none');
        }
    }
    backTop();


    //登录悬浮
    $('.index_user_headr').on('mouseenter',function(){
        $('.index_userMe').addClass('index_user_headerHover');
        $('.index_user_exit').stop().slideDown(200,function(){});

    }).on('mouseleave',function(){
        $('.index_user_exit').stop().slideUp(200,function(){
            $('.index_userMe').removeClass('index_user_headerHover');
        });
        
    })
})