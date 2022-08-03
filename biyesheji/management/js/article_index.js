$(function(){
    ajaxList();
    //点击查询事件
    $('#article_btnsou').on('click',function(){
        ajaxList();
        return false;
    })

    //封装删除的Ajax请求
    function ajaxDel() {
        //点击删除时事件
        $('.click_del').on('click', 'a:eq(1)', function () {
            let recipeId = $(this).attr('data-id');
            let determine = confirm('确认删除该条信息吗？（删除将无法复原）');
            if (determine) {
                //发送删除Ajax请求
                $.ajax({
                    beforeSend: function (request) {
                        request.setRequestHeader('Authorization', 'Bearer ' + window.localStorage.getItem('tokenRoot'));
                    },
                    type: "POST",
                    url: "http://localhost:8080/articleList/delArticle",
                    data: JSON.stringify({
                        id:recipeId
                    }),
                    contentType:'application/json',
                    success: function (data) {
                        console.log(data);
                        if(data.status == 1){
                            alert('用户删除成功！');
                            window.location.reload();
                        }
                    },
                    error:function(err){
                        if(err){
                            alert('网络连接出错！');
                            console.log(err);
                        } 
                    }
                });
            }
        })
    }

    //封装请求函数
    function ajaxList(){
        //发送Ajax请求
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/articleList/getArticleList",
            data:{
                title:$('#article_sou').val()
            },
            success: function (data) {
                let htmlCon = '';
                for(let i in data){
                    htmlCon+=`<tr class="articles">
                    <td>${data[i].article_id}</td>
                    <td>${data[i].article_class}</td>
                    <td>${data[i].article_title}</td>
                    <td><img height="50px" src="${data[i].article_img}"></td>
                    <td>${data[i].article_titleTwo}</td>
                    <td>${data[i].article_sort}</td>
                    <td>${data[i].article_new}</td>
                    <td>${data[i].original}</td>
                    <td>修改页面查看</td>
                    <td class ="click_del"><a href="./article_update.html?title=${data[i].article_id}">修改</a> | <a class="del" data-id="${data[i].article_id}" href="javascript:;">删除</a>
                    </td>
                </tr>`
                }
                $('tbody').html(htmlCon);
                //引用删除函数
                ajaxDel();
            }
        });
    }
})