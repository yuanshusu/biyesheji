$(function () {
    //请求数据
    getAjaxPage(1);

    //搜索框菜谱
    $('#recipe_sou').on('click', function () {
        let textVal = $('#sou_val').val();
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/manageUser/getUserRecipeName",
            data: {
                textVal: textVal
            },
            success: function (data) {
                if (data.status == 1) {
                    if (data.array.length > 1) {
                        //设置当前的分页
                        $('.pagination').html(`
                        <li class="page-item" id="page_top"><a class="page-link" href="javascript:;" >&lt;&lt;</a></li>
                        <li class="page-item"><a class="page-link" href="javascript:;">${data.array[0]}</a></li>
                        <li class="page-item"><a class="page-link" href="javascript:;">${data.array[1]}</a></li>
                        <li class="page-item"><a class="page-link" href="javascript:;">${data.array[2]}</a></li>
                        <li class="page-item" id="page_next"><a class="page-link" href="javascript:;">&gt;&gt;</a></li>
                        <li class="page-item"><a class="page-link" href="javascript:;" style="pointer-events: none;" >当前第<span>1</span>页</a></li>
                        `);
                    } else {
                        //不显示分页
                        $('#recipe_page').hide();
                        $('.pagination').html('');
                    }
                    //循环添加列表
                    let ulContai = '';
                    for (let i in data.data) {
                        // console.log(data.data[i]);
                        ulContai += `<tr class="id71">
                            <td>${data.data[i].main_id}</td>
                            <td><img height="55px" src="${data.data[i].coverImg}"></td>
                            <td>${data.data[i].title}</td>
                            <td>${data.data[i].ingrediendMain}</td>
                            <td>${data.data[i].user_id}</td>
                            <td>${data.data[i].list_id}</td>
                            <td>${data.data[i].browse}</td>
                            <td>${data.data[i].skills1}</td>
                            <td>${data.data[i].skills2}</td>
                            <td>${data.data[i].skills3}</td>
                            <td>${data.data[i].skills4}</td>
                            <td>${data.data[i].mainNumber}</td>
                            <td>${data.data[i].people}</td>
                            <td>${data.data[i].ingrediendTwo}</td>
                            <td>${data.data[i].twoNumber}</td>
                            <td>${data.data[i].introdace}</td>
                            <td>
                                <img height="55px" src="${data.data[i].successImg}">
                            </td>
                            <td class ="click_del"><a href="./recipe_update.html?id=${data.data[i].main_id}" >修改</a> | <a class="del" data-id="${data.data[i].main_id}" href="javascript:;">删除</a>
                            </td>
                        </tr>`
                    }
                    $('tbody').html(ulContai);
                    ajaxDel();
                }
            },
            error: function (err) {
                if (err) {
                    alert('网络连接出错！')
                }
            }
        });
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
                    url: "http://localhost:8080/manageUser/delRecipe",
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

    //封装请求分页的请求
    function getAjaxPage(page) {
        //发送Ajax请求
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/manageUser/getUserRecipeList?page=" + page,
            success: function (data) {
                // console.log(data);
                if (data.status == 1) {
                    //返回当前的页数
                    $('#recipe_page').html(`共${data.pageNum}条`);
                    //设置当前的分页
                    $('.pagination').html(`
                    <li class="page-item" id="page_top"><a class="page-link" href="javascript:;" >&lt;&lt;</a></li>
                    <li class="page-item"><a class="page-link" href="javascript:;">${data.array[0]}</a></li>
                    <li class="page-item"><a class="page-link" href="javascript:;">${data.array[1]}</a></li>
                    <li class="page-item"><a class="page-link" href="javascript:;">${data.array[2]}</a></li>
                    <li class="page-item" id="page_next"><a class="page-link" href="javascript:;">&gt;&gt;</a></li>
                    <li class="page-item"><a class="page-link" href="javascript:;" style="pointer-events: none;" >当前第<span>${data.nowPage}</span>页</a></li>
                    `);
                    //循环添加列表
                    let ulContai = '';
                    for (let i in data.data) {
                        // console.log(data.data[i]);
                        ulContai += `<tr class="id71">
                            <td>${data.data[i].main_id}</td>
                            <td><img height="55px" src="${data.data[i].coverImg}"></td>
                            <td>${data.data[i].title}</td>
                            <td>${data.data[i].ingrediendMain}</td>
                            <td>${data.data[i].user_id}</td>
                            <td>${data.data[i].list_id}</td>
                            <td>${data.data[i].browse}</td>
                            <td>${data.data[i].skills1}</td>
                            <td>${data.data[i].skills2}</td>
                            <td>${data.data[i].skills3}</td>
                            <td>${data.data[i].skills4}</td>
                            <td>${data.data[i].mainNumber}</td>
                            <td>${data.data[i].people}</td>
                            <td>${data.data[i].ingrediendTwo}</td>
                            <td>${data.data[i].twoNumber}</td>
                            <td>${data.data[i].introdace}</td>
                            <td>
                                <img height="55px" src="${data.data[i].successImg}">
                            </td>
                            <td class ="click_del"><a href="./recipe_update.html?id=${data.data[i].main_id}" >修改</a> | <a class="del" data-id="${data.data[i].main_id}" href="javascript:;">删除</a>
                            </td>
                        </tr>`
                    }
                    $('tbody').html(ulContai);
                }
                //添加分页动态事件
                $('.pagination').on('click', 'a', function () {
                    let nowPage = parseInt($('.pagination').find('li:last-child').find('span').text());
                    if ($(this).parent('li').attr('id') == 'page_top') {
                        if (nowPage == 1) {
                            return false;
                        } else {
                            getAjaxPage(nowPage - 1);
                        }
                    } else if ($(this).parent('li').attr('id') == 'page_next') {
                        if (nowPage == Math.ceil(data.pageNum / 10)) {
                            return false;
                        } else {
                            getAjaxPage(nowPage + 1);
                        }
                    } else {
                        getAjaxPage($(this).text());
                    }
                })
                //引用删除函数
                ajaxDel();
            },
            error: function (err) {
                if (err) {
                    alert('网络连接出错！')
                }
            }
        });
    }
})