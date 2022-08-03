$(function(){
    //获取最新的文章
    ajaxClass();

    //返回顶部
    $('.index_backTop').on('click',function(){
        $('html').animate({
            scrollTop:0
        },500);
    })

    //点击分类
    $('.health_selectUl').on('click','li',function(){
        $(this).addClass('selectUl_itemClick').siblings('li').removeClass('selectUl_itemClick');
        //ajax请求
        ajaxClass();
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

    //封装函数，当点击顶部的分类发送不同的Ajax请求
    function ajaxClass(){
        let newArticle = $('.selectUl_itemClick').find('a').text();
        //首先发送一个获取最新文章的请求
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/health/getArticleList",
            data: {
                class:newArticle
            },
            success: function (data) {
                let articleContainer ='';
                for(let i in data){
                    //发送Ajax请求评论的数量
                    let articleCom = '';
                    $.ajax({
                        type: "GET",
                        url: "http://localhost:8080/health/getComments",
                        async:false,
                        data:{
                            articleId:data[i].article_id
                        },
                        success: function (datas) {
                            articleCom = datas.length;
                        }
                    });

                    data[i].article_new = data[i].article_new.replace('T',' ');
                    data[i].article_new = data[i].article_new.replace('.000Z','');
                    articleContainer+=`<div class='column'>
                    <a href="content.html?articleId=${data[i].article_id}">
                      <div class='post-module'>
                        <!--缩略图-->
                        <div class='thumbnail'>
                          <img src='${data[i].article_img}'>
                        </div>
                        <div class='post-content'>
                          <div class='category'>${data[i].article_class}</div>
                          <h1 class='title'>${data[i].article_title}</h1>
                          <h2 class='sub_title'>${data[i].article_titleTwo}</h2>
                          <p class='description'>${data[i].article_sort}
                          </p>
                          <div class='post-meta'>
                            <span class='timestamp'>
                              <i class='fa fa-clock-o'></i>${data[i].article_new}
                            </span>
                            <span class='comments'>
                              <i class='fa fa-comments'></i>
                              <a href='content.html?articleId=${data[i].article_id}'>${articleCom}评论</a>
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>`;
                }
                $('.column_list').html(articleContainer);
    
                //控制文字的显示与隐藏
                $('.post-module').hover(function () {
                    $(this).find('.description').stop().animate({
                        height: 'toggle',
                        opacity: 'toggle'
                    }, 300);
                });
            }
        });
    }
})