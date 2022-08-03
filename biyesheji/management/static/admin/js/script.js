

$(document).ready(function() {

    //点击高亮
    $('.menu a').click(function () {
        let href = $(this).attr('href');
        if(href!='javascript:;'){
            $('.menu a').removeClass('active');
            $(this).addClass('active');
        }
    })

    //菜单收展
    $('.menu .top-menu').click(function () {

        let pa = $(this).parent();

        if(pa.hasClass('unwind')){
            pa.removeClass('unwind');
        }else{
            pa.addClass('unwind');
        }


    })
    //删除
    $(".del").click(function () {
        var url = $(this).attr("href");
        var id = $(this).attr("data-id");

        layer.confirm('你确定要删除么?', {
            btn: ['确定', '取消']
        }, function () {
            $.get(url, function (data) {
                if (data.code == 1) {
                    $(id).fadeOut();
                    layer.msg(data.msg, {icon: 1});
                } else {
                    layer.msg(data.msg, {icon: 2});
                }
            });
        }, function () {
            layer.msg("您取消了删除!");
        });
        return false;
    });
})

function delCache(){
    sessionStorage.clear();
    localStorage.clear();
}






