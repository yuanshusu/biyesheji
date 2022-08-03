$(function(){
    let recipeId = window.location.search;
    recipeId = recipeId.slice(4);
    $('#displayNo').val(recipeId);
    //点击提交的时候
    $('#btnValue').on('click',function(){
        //获取表单数据
        let formData = $('#recipeForm').serializeArray();
        console.log(formData);
        $.ajax({
            beforeSend: function (request) {
                request.setRequestHeader('Authorization', 'Bearer ' + window.localStorage.getItem('tokenRoot'));
            },
            type: "POST",
            url: "http://localhost:8080/manageUser/updateRecipe",
            data: JSON.stringify(formData),
            contentType: "application/json;charset=utf-8",//解决中文乱码问题
            success: function (data) {
                if(data.status ==1){
                    alert('修改菜谱成功！');
                }
            }
        });
    })
})