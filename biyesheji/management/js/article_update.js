$(function(){
    //富文本
    let E = window.wangEditor;
    let editor = new E('#wangEditor');
    editor.create();

    //获取文章内容
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/articleList/getArticleList"+window.location.search,
        success: function (data) {
            $('#article_con').val(data[0].article);
            //把数据显示到富文本中
            editor.txt.html(data[0].article);
            $('#articleID').val(window.location.search.slice(7));
        }
    });
    //点击上传,修改内容
    $('#article_sub').on('click',function(){
        //把富文本的值给文本域
        $('#article_con').val(editor.txt.html());
        //获取表单数据
        let formData = $('#docForm').serializeArray();
        $.ajax({
            beforeSend: function (request) {
                request.setRequestHeader('Authorization', 'Bearer ' + window.localStorage.getItem('tokenRoot'));
            },
            type: "POST",
            url: "http://localhost:8080/articleList/updateArticle",
            data: JSON.stringify(formData),
            contentType: "application/json;charset=utf-8",//解决中文乱码问题
            success: function (data) {
                // console.log(data);
                if(data.status ==1){
                    alert('修改菜谱成功！');
                }
            }
        });
        return false;
    })
})