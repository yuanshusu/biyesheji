$(function(){
    //定义一个判断是否上传了图片的变量
    let flag = 0;
    //判断图片是否改变
    let flagImg = 0;
    //发送Ajax请求，获取菜系编号
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/recipe/getUserMain",
        success: function (data) {
            let htmlFor = '';
            data.forEach(element => {
                htmlFor += `<option value="${element.id}">${element.foodname}</option>`
            });
            $('#listMian').html(htmlFor);
        }
    });

    //创建一个forData对象
    let dataForm = new FormData();
    $('#fileImg').on('change',function(){
        let name = $(this)[0].files[0].name;
        if(name.match(/jpg$/gi) != null){
            dataForm.append('file',$(this)[0].files[0]);
            flagImg = 1;
        }else{
            flagImg = 0;
            alert('请输入jpg格式的图片');
        }
    })

    //当点击上传图片的时候，会像静态服务器中上传图片，并返回当前的静态路径
    $('#imgLoad').on('click',function(){
        if(flagImg){
            $.ajax({
                beforeSend: function (request) {
                    request.setRequestHeader('Authorization', 'Bearer ' + window.localStorage.getItem('tokenRoot'));
                },
                type: "POST",
                url: "http://localhost:8080/manageUser/upLoadImg",
                data: dataForm,
                processData: false, // 告诉jQuery不要去处理发送的数据
                contentType: false, // 告诉jQuery不要去设置Content-Type请求头
                dataType: 'text',
                success: function (data) {
                    console.log(JSON.parse(data).path);
                    if(data.status == 0){
                        alert('上传图片失败!')
                    }else{
                        alert('上传成功！')
                        $('#coverImg').attr('src',JSON.parse(data).path);
                        $('#disImg').val(JSON.parse(data).path);
                        flag = 1;
                    }
    
                }
            });
            return false;
        }else{
            return false;
        }
    })

    //点击提交的时候
    $('#btn_tj').on('click',function(){
        if(flag){
            let formData = $('#recipe_form').serializeArray();
            console.log(formData);
            $.ajax({
                beforeSend: function (request) {
                    request.setRequestHeader('Authorization', 'Bearer ' + window.localStorage.getItem('tokenRoot'));
                },
                type: "POST",
                url: "http://localhost:8080/manageUser/createRecipe",
                data: JSON.stringify(formData),
                contentType: "application/json;charset=utf-8",//解决中文乱码问题
                success: function (data) {
                    console.log(data);
                    if(data.status ==1){
                        alert('菜谱菜谱成功！');
                    }else{
                        alert('菜谱上传失败，请修改后在次上传');
                    }
                }
            });
        }else{
            alert('请先上传图片');
            return false;
        }
    })
})