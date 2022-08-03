$(function(){
    //请求所有的评论
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/comments/getComment",
        success: function (data) {
            let htmlList = '';
            for(let i in data){
                htmlList+= `
                <tr class="container_com">
                    <td>${data[i].com_id}</td>
                    <td>${data[i].com_content}</td>
                    <td>${data[i].com_data}</td>
                    <td>${data[i].user_id}</td>
                    <td>${data[i].article_id}</td>
                    <td class="delTd"><a class="comDel" data-id="${data[i].com_id}" href="javascript:;">删除</a>
                    </td>
                </tr>`
            }
            $('tbody').html(htmlList);
            delCom();
        }
    });

    //模糊查询评论内容
    $('#comment_btn').on('click',function(){
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/comments/updateComment",
            data: {
                textVal:$('#comment_sou').val()
            },
            success: function (data) {
                let htmlList = '';
            for(let i in data){
                htmlList+= `
                <tr class="container_com">
                    <td>${data[i].com_id}</td>
                    <td>${data[i].com_content}</td>
                    <td>${data[i].com_data}</td>
                    <td>${data[i].user_id}</td>
                    <td>${data[i].article_id}</td>
                    <td class="delTd"><a class="comDel" data-id="${data[i].com_id}" href="javascript:;">删除</a>
                    </td>
                </tr>`
            }
            $('tbody').html(htmlList);
            delCom();
            },
            error:function(err){
                if(err){
                    alert('网络连接出错！')
                } 
            }
        });
        return false;
    })

    //封装删除函数
    function delCom(){
        $('.delTd').on('click','.comDel',function(){
            let delInfo = confirm('确认删除吗？该操作会导致删除且无法恢复！');
            if(delInfo){
                let userId = $(this).attr('data-id');
                $.ajax({
                    beforeSend: function (request) {
                        request.setRequestHeader('Authorization', 'Bearer ' + window.localStorage.getItem('tokenRoot'));
                    },
                    type: "POST",
                    url: "http://localhost:8080/comments/delCommentId",
                    data: JSON.stringify({
                        id:userId
                    }),
                    contentType:'application/json',
                    success: function (data) {
                        if(data.status == 1){
                            alert('评论删除成功！');
                            window.location.reload();
                        }
                    },
                    error:function(err){
                        if(err){
                            alert('网络连接出错！')
                        } 
                    }
                });
            }
        })
   }

})