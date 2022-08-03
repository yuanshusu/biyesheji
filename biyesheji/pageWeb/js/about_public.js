$(function () {
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
        //顶部导航栏显示隐藏
        if ($(window).scrollTop() > 150) {
            $('.about_header').css('background', 'rgba(255, 255, 255, 1)').find('a').css('color', '#000');

        } else {
            $('.about_header').css('background', 'rgba(255, 255, 255, 0)').find('a').css('color', '#fff');
        }
    }
    backTop();

})