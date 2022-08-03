$(function(){
    let userid= window.location.search;
    //获取表单的值
    $('#submitInfo').on('click',function(){
        let username = $('#username').val().replace(/\s+/g,"");
        let userRoot = $('#userRoot').val().replace(/\s+/g,"");
            if(username&&userRoot){
                if((userRoot == 'root')|| (userRoot =='admin')){
                    let btnInfo =  confirm('确定要提交吗？');
                    if(btnInfo){
                        //发送Ajax请求
                        $.ajax({
                            beforeSend: function (request) {
                                request.setRequestHeader('Authorization', 'Bearer ' + window.localStorage.getItem('tokenRoot'));
                            },
                            type: "POST",
                            url: "http://localhost:8080/manageUser/updateUser",
                            data: JSON.stringify({
                                username:username,
                                userRoot:userRoot,
                                userId:userid
                            }),
                            contentType:'application/json',
                            success: function (data) {
                                if(data.status == 1){
                                    alert('用户修改成功！');
                                    window.history.back();
                                }
                            },
                            error:function(err){
                                if(err){
                                    alert('网络连接出错！')
                                } 
                            }
                        });
                    }
                }else{
                    alert('输入的表单不合乎要求！');
                    return false;
                }


            }
    })

})