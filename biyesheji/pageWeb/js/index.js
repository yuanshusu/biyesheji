$(function(){
    //Ajax请求三餐推荐
    let foodArr = ['.index_breakfast','.index_lunch','.index_afterTea','.index_dinner','.index_nightFood']
    //定义推荐模块
    let moduleArr = ['new','listId','roushi','health','baking'];
    //填充的数据
    let moduleIdArr =['#index_new','#index_listId','#index_roushi','#index_health','#index_baking'];
    for(let i=0; i<foodArr.length;i++){
        //Ajax封装函数
        ajaxFood(foodArr[i],i);
        ajaxModule(moduleArr[i],moduleIdArr[i]);
    }


    let newDate = new Date();
    let newHours = newDate.getHours();

    //三餐图片字体
    $('.index_breakfast_item').on('mouseenter',function(){
        $(this).children('.index_breakfast_title').css('color','rgb(246,77,54)');
    }).on('mouseleave',function(){
        $(this).children('.index_breakfast_title').css('color','#222');
    });

    //底部文字变色
    $('#index_bottomul').on('mouseenter','li',function(){
        $(this).find('a').css('color','rgb(246,77,54)');
    }).on('mouseleave','li',function(){
        $(this).find('a').css('color','#fff');
    });

    //三餐文字按钮
    $('#index_ul').on('click','li',function(){
        let idx =  '-'+$(this).index()*100+'%';
        $(this).addClass('current').siblings('li').removeClass('current');
        $('#index_ulImg').animate({
            left:idx
        });
    })
    //自动显示当前的餐数
    if(newHours>=4 && newHours<=10){
        $('#index_ul').find('li:eq(0)').addClass('current').siblings('li').removeClass('current');
        $('#index_ulImg').css('left','0');
        console.log('早餐');
    }else if(newHours>=11 && newHours<=13){
        $('#index_ul').find('li:eq(1)').addClass('current').siblings('li').removeClass('current');
        $('#index_ulImg').css('left','-100%');
        console.log('午餐');
    }else if(newHours>=14 && newHours<=17){
        $('#index_ul').find('li:eq(2)').addClass('current').siblings('li').removeClass('current');
        $('#index_ulImg').css('left','-200%');
        console.log('下午茶');
    }else if(newHours>=18 && newHours <= 22){
        $('#index_ul').find('li:eq(3)').addClass('current').siblings('li').removeClass('current');
        $('#index_ulImg').css('left','-300%');
        console.log('晚餐');
    }else if((newHours>=23 && newHours<=24) || (newHours>=0 &&newHours<=3)){
        $('#index_ul').find('li:eq(4)').addClass('current').siblings('li').removeClass('current');
        $('#index_ulImg').css('left','-400%');
        console.log('夜宵');
    }
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
        //顶部导航栏显示隐藏
        if($(window).scrollTop()>200){
            $('.index_index').css('background','rgba(249, 78, 82, 1)');
        }else{
            $('.index_index').css('background','rgba(249, 78, 82, 0)');
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

    //封装请求的模块Ajax数据
    function ajaxModule(getData,moduleId){
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/index/getIndexModule?getData="+getData,
            success: function (data) {
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
                $(moduleId).html(recipeHtml);
    
                //作者动画
                $('.content_item').on('mouseenter',function(){
                    $(this).children('.item_hidden').stop().slideDown(400,function(){});
                }).on('mouseleave',function(){
                    $(this).children('.item_hidden').stop().slideUp(400,function(){});
                })
            }
        });
    }

    //封装Ajax请求函数
    function ajaxFood(className,y){
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/index/getIndexFood",
            data: {
                listId:$('#index_ul').find(`li:eq(${y})`).attr('data-food')
            },
            success: function (data) {
                let foodList ='';
                for(let i in data){
                    foodList+=`<a href="article.html?name=${data[i].main_id}" class="index_breakfast_item">
                        <div class="index_breakfast_z1" style="background:url(${data[i].coverImg}) center no-repeat;background-size:cover;"></div>
                        <strong class="index_breakfast_title">${data[i].title}</strong>
                        <p class="index_breakfast_p">${data[i].biaoyu}</p>
                    </a>`
                }
                $(className).html(foodList);
    
                //三餐图片字体
                $('.index_breakfast_item').on('mouseenter',function(){
                    $(this).children('.index_breakfast_title').css('color','rgb(246,77,54)');
                }).on('mouseleave',function(){
                    $(this).children('.index_breakfast_title').css('color','#222');
                });
            }
        });
    }
})