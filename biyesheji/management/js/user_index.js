$(function(){
    //获取当前数据库中所有的用户列表
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/manageUser/getUserMain",
        success: function (data) {
            if(data.status == 0){
                return false;
            }
            //连接内容
            let htmlCon = '';
            for(let i in data){
                htmlCon+=`<tr>
                <th scope="row">${data[i].id}</th>
                <td>${data[i].name}</td>
                <td>${data[i].username}</td>
                <td>${data[i].root}</td>
                <td class="delTd">
                    <a href="user_update.html?id=${data[i].id}">修改</a>
                    <a class="del uerDel" href="javascript:;">删除</a>
                </td>
            </tr>`
            }
            $('tbody').html(htmlCon);
            delUser();
        },
        error:function(err){
            if(err){
                alert('网络连接出错！')
            }
        }
    });

    //点击查询
    $('#btn_sou').on('click',function(){
        let username=$('#input_sou').val();
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/manageUser/getUserList",
            data: {
                name:username
            },
            success: function (data) {
                if(data.status == 0){
                    return false;
                }
                $('tbody').html(`<tr>
                    <th scope="row">${data[0].id}</th>
                    <td>${data[0].name}</td>
                    <td>${data[0].username}</td>
                    <td>${data[0].root}</td>
                    <td class="delTd">
                        <a href="user_update.html?id=${data[0].id}">修改</a>
                        <a class="del uerDel" href="javascript:;">删除</a>
                    </td>
                </tr>`)
                //点击删除事件
                delUser();
            },
            error:function(err){
                if(err){
                    alert('网络连接出错！')
                }
            }
        });
        return false;
    })

   function delUser(){
        $('.delTd').on('click','.uerDel',function(){
            let delInfo = confirm('确认删除吗？该操作会导致用户删除且无法恢复！');
            if(delInfo){
                let userId = $(this).parent('td').siblings('th').text();
                $.ajax({
                    beforeSend: function (request) {
                        request.setRequestHeader('Authorization', 'Bearer ' + window.localStorage.getItem('tokenRoot'));
                    },
                    type: "POST",
                    url: "http://localhost:8080/manageUser/delUser",
                    data: JSON.stringify({
                        id:userId
                    }),
                    contentType:'application/json',
                    success: function (data) {
                        if(data.status == 1){
                            alert('用户删除成功！');
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