$(function(){
    //创建富文本
    let E = window.wangEditor;
    let editor = new E('#wangEditor');
    editor.create();

    //点击事件，获取富文本的值
    $('#create_btn').on('click',function(){
        //将富文本框的值赋值到文本域中
        $('#article_con').val(editor.txt.html());
        //获取表单数据
        let formData = $('#create_form').serializeArray();
        //发送Ajax请求
        $.ajax({
            beforeSend: function (request) {
                request.setRequestHeader('Authorization', 'Bearer ' + window.localStorage.getItem('tokenRoot'));
            },
            type: "POST",
            url: "http://localhost:8080/articleList/createArticle",
            data: JSON.stringify(formData),
            contentType: "application/json;charset=utf-8",//解决中文乱码问题
            success: function (data) {
                if(data.status == 1){
                    alert('文章发布成功！');
                    setTimeout(function(){
                        window.location.reload();
                    },300)
                }
            }
        });
        return false;
    })
})