$(function(){
    let mainData = 0;
    //立即获取所有的菜谱
    (function(){
        //发送Ajax请求，获取所有的菜谱
        let judeg = $('.rightBox_newName').attr('data-listName');
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/recipe/getRecipeMain",
            data:{
               sort:$('.rightBox_hover').text(),
               listId:judeg
            },
            success: function (data) {
                if(data.status == 0){
                    alert('网络连接超时！');
                }
                //改变小标题
                $('.rightBox_newName').text('全部菜谱的做法');
                mainData = data;
                forData(data);
            },
            error:function(err){
                alert('网络连接超时，请刷新后重试！');
            }
        });
    })()

    //返回顶部
    $('.index_backTop').on('click', function () {
        $('html').animate({
            scrollTop: 0
        }, 500);
    })
    //显示隐藏
    $(window).scroll(function () {
        backTop()
    })

    function backTop() {
        //返回顶部的显示与隐藏
        if ($(window).scrollTop() > $('body').height() / 2) {
            $('.index_backTop').css('display', 'block');
        } else {
            $('.index_backTop').css('display', 'none');
        }
    }
    backTop();

    //菜单悬浮
    $('.leftBox_ulList').on('mouseenter','li',function(){
        $(this).addClass('itemHover').siblings('li').removeClass('itemHover');
        $('.leftBox_display').show();
        // Ajax请求请求菜谱列表
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/recipe/getMainList?name="+$(this).find('strong').text(),
            success: function (data) {
                let listHtml = '';
                //遍历json对象
                for(let i in data){
                    // console.log(data[i]);
                    listHtml = listHtml+
                    `<span class="leftBox_span">
                        <em>
                            <a href="javascript:;" data-serverId="${data[i].id}">${data[i].foodname}</a>
                        </em>
                    </span>`;
                }
                $('.leftBox_display').html(listHtml);
            },
            error:function(err){
                $('.leftBox_display').html('<h1>网络连接错误!</h1>');
            }
        });
    }).on('mouseleave','li',function(){
        $(this).removeClass('itemHover');
    }).on('mouseleave',function(){
        $('.leftBox_display').hide();
    })

    //点击分类
    $('.leftBox_display').on('click','.leftBox_span a',function(){
        //改变右边的字
        $('.rightBox_newName').attr('data-listName',$(this).attr('data-serverid')).text($(this).text()+'的做法');
        //发送Ajax请求请求数据库
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/recipe/getRecipeList:"+$('.rightBox_newName').attr('data-listName'),
            data:{
                sort:$('li .rightBox_hover').text()
            },
            success: function (data) {
                forData(data);
            },
            error:function(err){
                alert('网络连接超时，请刷新后重试！');
            }
        });
    })

    //点击排序
    $('.rightBox_ul').on('click','em',function(){
        $(this).addClass('rightBox_hover').parent('li').siblings('li').find('em').removeClass('rightBox_hover');
        let judeg = $('.rightBox_newName').attr('data-listName');
        //发送总的Ajax请求
        if(judeg == 'main'){
            $.ajax({
                type: "GET",
                url: "http://localhost:8080/recipe/getRecipeMain",
                data:{
                    sort:$('li .rightBox_hover').text(),
                    listId:judeg
                },
                success: function (data) {
                    if(data.status == 0){
                        alert('网络连接超时！');
                    }
                    forData(data);
                },
                error:function(err){
                    alert('网络连接超时，请刷新后重试！');
                }
            });
            return false;
        }

        //发送分类的请求
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/recipe/getRecipeList:"+$('.rightBox_newName').attr('data-listName'),
            data:{
                sort:$('li .rightBox_hover').text()
            },
            success: function (data) {
                forData(data);
            },
            error:function(err){
                alert('网络连接超时，请刷新后重试！');
            }
        });
        
    })

    //登录悬浮
    $('.index_user_headr').on('mouseenter',function(){
        $('.index_userMe').addClass('index_user_headerHover');
        $('.index_user_exit').stop().slideDown(200,function(){});

    }).on('mouseleave',function(){
        $('.index_user_exit').stop().slideUp(200,function(){
            $('.index_userMe').removeClass('index_user_headerHover');
        });
        
    })

    //点击分页事件
    $('.page_list').on('click','a',function(){
        forData(mainData,$(this).text());
        $(this).addClass('page_listClick').parent('li').siblings('li').find('a').removeClass('page_listClick');
    })
    //点击上一页的代码
    $('#page_top').on('click',function(){
        let num = $('.page_listClick').text();
        //当前位于第一个
        if(num<=1){
            return false;
        }
        $('.page_listClick').removeClass('page_listClick').parent('li').prev('li').find('a').addClass('page_listClick');
        forData(mainData,parseInt(num)-1);
        
    })
    //下一页的代码
    $('#page_down').on('click',function(){
        let teger = $('.page_listClick').parent().next().find('a').length;
        let num = parseInt($('.page_listClick').text())+1;
        //当前位于最后一个
        if(teger == 0){
            return false;
        }
        $('.page_listClick').removeClass('page_listClick').parent('li').next('li').find('a').addClass('page_listClick');
        forData(mainData,num);
    })

    //封装遍历列表函数
    function forData(data,i){
        i=i?i:1;
        //显示的页数
        let dataPage =Math.ceil(data.length/28);
        //拼接的分页代码
        let pageContai = '';
        for(let x=1; x<=dataPage;x++){
            pageContai+=`<li>
                <a href="javascript:;" class="page_listItem">${x}</a>
           </li>`;
        }
        //显示在页面中
        $('.page_list').html(pageContai);
        //设置当前第一个li为点击
        $('.page_list').find('li').eq(i-1).find('a').addClass('page_listClick');
        if(dataPage<=1){
            $('.recipe_pages').css('display','none')
        }

        //显示截取的数据
        data=data.slice(28*(i-1),28*i);
        //遍历数据显示在页面
        let recipeHtml = '';
        for(let i in data){
            let username = null;
            let userImg = null;
            //发送Ajax请求查询当前的用户
            $.ajax({
                type: "GET",
                async : false,
                url: "http://localhost:8080/recipe/getRecipeImg?userId="+data[i].main_id,
                success: function (data) {
                    userImg = data[0].headerImg;
                    username = data[0].username;
                }
            });
            //拼接页面
            recipeHtml = recipeHtml+
            `<div class="index_content_item">
                <div class="content_item">
                    <a href="article.html?name=${data[i].main_id}" class="item_img" data-listInfo="${data[i].main_id}"
                     style="background:url(${data[i].coverImg}) center no-repeat;background-size:cover;" ></a>
                    <a href="#" class="item_hidden">
                        <div class="item_hidden_img"  style="background:url(${userImg}) center no-repeat;background-size:cover;"></div>
                        <strong class="item_hidden_name">${username}</strong>
                    </a>
                </div>
                <a href="article.html?name=${data[i].main_id}" class="content_info" data-listInfo="${data[i].main_id}">
                    <strong class="info_name">${data[i].title}</strong>
                    <span class="info_material">${data[i].ingrediendMain}</span>
                </a>
            </div>`;
            //拼接上分页
        }
        //显示在页面中
        $('#recipe_containers').html(recipeHtml);

        //作者动画
        $('.content_item').on('mouseenter',function(){
            $(this).children('.item_hidden').stop().slideDown(400,function(){});
        }).on('mouseleave',function(){
            $(this).children('.item_hidden').stop().slideUp(400,function(){});
        })
    }
})