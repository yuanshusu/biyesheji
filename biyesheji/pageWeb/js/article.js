$(function(){
    //获取导航栏中的信息
    let mainId = window.location.search.slice(1)
    //发送Ajax请求
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/article/getArticleContainer",
        data: mainId,
        success: function (data) {
            if(data.status == 0){
                alert('网络连接出错！');
                setTimeout(function(){
                    window.location.href = 'NotFound404.html';
                },500)
            }
            //改变网站的标题
            document.title = data[0].title+'的做法 - 轻食美食';
            //主料和量
            let mainliao = data[0].ingrediendMain.split(',');
            let mainNumber = data[0].mainNumber.split(',');
            //辅料和量
            let twoliao = data[0].ingrediendTwo.split(',');
            let twoNumber = data[0].twoNumber.split(',');
            let maincom = '';
            let twocom = '';
            for(let i=0; i<mainliao.length;i++){
                maincom = maincom+`<strong>${mainliao[i]} ${mainNumber[i]}</strong>`;
            }
            for(let y= 0;y<twoliao.length;y++){
                twocom = twocom+`<strong>${twoliao[y]} ${twoNumber[y]}</strong>`;
            }
            //用户名和头像
            let userImg ='';
            let username = '';
            //发送Ajax请求查询当前的用户
            $.ajax({
                type: "GET",
                async : false,
                url: "http://localhost:8080/recipe/getRecipeImg?userId="+data[0].main_id,
                success: function (data) {
                    userImg = data[0].headerImg;
                    username = data[0].username;
                }
            });
            //步骤内容
            let steps = '';
            //发送Ajax请求查询当前菜的步骤
            $.ajax({
                type: "GET",
                url: "http://localhost:8080/article/getArticleSteps",
                async : false,
                data: {
                    mainId:data[0].main_id
                },
                success: function (data) {
                    for(let i in data){
                        let x= 1+parseInt(i);
                        steps+= `<div class="article_setp">
                            <div class="article_setpLeft">
                                <strong>步骤</strong>
                                <em>step</em>
                                <p>${x}</p>
                            </div>
                            <div class="article_setpRight">
                                <img src="${data[i].setpImg}" alt="步骤${x}" title="步骤${x}">
                                <p>${data[i].setpNumber}</p>
                            </div>
                        </div>`
                    }
                }
            });

            $('.article_main').html(`<!-- 文章头 -->
            <article class="article_article">
                <div class="article_article_mar">
                    <div class="article_imgDiv">
                        <img src="${data[0].coverImg}" alt="${data[0].title}" title="${data[0].title}">
                    </div>
                    <div class="article_middleDiv">
                        <div class="article_material">
                                <div class="article_materialTop">
                                    <h1 class="article_title_h1">${data[0].title}</h1>
                                    by <span class="span_username">${username}</span> · 
                                    <span class="span_browse">${data[0].browse}</span> 次浏览
                                </div>
                                <div class="article_infoIcon">
                                    <div class="info_icon info_icon_item1">
                                        <em>工艺</em>
                                        <strong>${data[0].skills1}</strong>
                                    </div>
                                    <div class="info_icon info_icon_item2">
                                        <em>口味</em>
                                        <strong>${data[0].skills2}</strong>
                                    </div>
                                    <div class="info_icon info_icon_item3">
                                        <em>时间</em>
                                        <strong>${data[0].skills3}</strong>
                                    </div>
                                    <div class="info_icon info_icon_item4">
                                        <em>难度</em>
                                        <strong>${data[0].skills4}</strong>
                                    </div>
                                </div>
                        </div>
                        <!-- 主辅 -->
                        <div class="article_ingredients">
                            <!-- 主 -->
                            <div class="article_ingredients_main">
                                <div class="ingredients_main_left">
                                    <strong>主料</strong>
                                    <em>main</em>
                                </div>
                                <div class="ingredients_main_right">
                                    ${maincom}
                                </div>
                                <span class="article_main_copy">${data[0].people}</span>
                            </div>
                            <!-- 次 -->
                            <div class="article_ingredients_main">
                                <div class="ingredients_main_left">
                                    <strong>辅料</strong>
                                    <em>others</em>
                                </div>
                                <div class="ingredients_main_right">
                                    ${twocom}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="article_authorDiv">
                        <div class="article_author">
                            <div class="article_authorImg">
                                <a href="javascript:;">
                                    <img src="${userImg}" alt="点击进入作者空间" title="作者">
                                </a>
                            </div>
                            <div class="article_authorInfo">
                                <a href="javascript:;" title="">
                                    <strong>${username}</strong>
                                </a>
                            </div>
                        </div>
                        <div class="article_words">
                            <p>${data[0].introdace}</p>
                        </div>
                    </div>
                </div>
            </article>


            <!-- 文章main -->
            <section class="article_container">
                <div class="container">
                    <div class="article_container_main">
                        <h2 class="article_containerTitle">${data[0].title}的做法</h2>
                        <!-- 步骤 -->
                        <div class="article_setpDiv">
                            ${steps}
                        </div>
                        <h2 class="article_containerLast">最后成品图</h2>
                        <!-- img -->
                        <div class="example article_showImg">
                            <img src="${data[0].successImg}" alt="成果展示" class="img-rounded">
                        </div>
                    </div>
                </div>
            </section>`);

            //初始化函数
            $('.img-rounded').zoomify(400);
            //放到作者名称上显示全名
            $('.article_authorInfo').find('a').prop('title', $('.article_authorInfo').find('strong').text());

            //给当前的菜谱增加一点击量
            let serverBrowse = JSON.stringify({
                Browse:data[0].main_id
            })
            $.ajax({
                type: "POST",
                url: "http://localhost:8080/article/setArticleBrowse",
                data: serverBrowse,
                contentType:'application/json',
                success: function (data) {
                    if(data.status ===1){
                        console.log('访问成功！');
                    }                  
                }
            });
        },
        Error:function(err){
            alert('网络连接出错！');
            setTimeout(function(){
                window.location.href = 'NotFound404.html';
            },500)
        }
    });

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