$(function() {
	var run = 0,
		timer;

	$("#start").click(function() {
		var list = $("#list").val().replace(/ +/g, " ").replace(/^ | $/g, "").split(" ");
		if(!run) {
			$(this).val("停止");
			timer = setInterval(function() {
				var r = Math.ceil(Math.random() * list.length),
					food = list[r - 1];
				$("#what").html(food);
				var rTop = Math.ceil(Math.random() * $(document).height()),
					rLeft = Math.ceil(Math.random() * ($(document).width() - 50)),
					rSize = Math.ceil(Math.random() * (37 - 14) + 14);
				$("<span class='eat_temp'></span>").html(food).hide().css({
					"top": rTop,
					"left": rLeft,
					"color": "rgba(0,0,0,." + Math.random() + ")",
					"fontSize": rSize + "px"
				}).appendTo("body").fadeIn("slow", function() {
					$(this).fadeOut("slow", function() {
						$(this).remove();
					});
				});
			}, 50);
			run = 1;
		} else {
			$(this).val("不行，换一个");
			clearInterval(timer);
			run = 0;
		};
	});
	document.onkeydown = function enter(e) {
		var e = e || event;
		if(e.keyCode == 13) $("#start").trigger("click");
	};
	
	//2.
	$i = 0;
	$('#start').click(function() {
		$i++;
		if($i >= 10) {
			$('#start').hide();
			$('#what').html('这么挑？饿着吧！');
		}
	})

	//底部文字变色
	$('#index_bottomul').on('mouseenter','li',function(){
		$(this).find('a').css('color','rgb(246,77,54)');
	}).on('mouseleave','li',function(){
		$(this).find('a').css('color','#fff');
	});
	$('.index_index').css('background','rgba(249, 78, 82, 1)');

	//4.
	document.oncontextmenu = function(event) {
		if(window.event) {
			event = window.event;
		}
		try {
			var the = event.srcElement;
			if(!((the.tagName == "INPUT" && the.type.toLowerCase() == "text") || the.tagName == "TEXTAREA")) {
				return false;
			}
			return true;
		} catch(e) {
			return false;
		}
	}

	//6.
	if(self == top) {
		var theBody = document.getElementsByTagName('body')[0];
		theBody.style.display = "block";
	} else {
		top.location = self.location;
	}

	//添加按钮
	$('#add_word').on('click',function(){
		let addFood = prompt('请输入你要添加的饭(每次添加一个,可多次添加)：');
		if(addFood){
			$('#list').val($('#list').val()+" "+addFood);
			alert('添加成功！');
		}
		
	})
	//去除按钮
	$('#remove_word').on('click',function(){
		let removeFood = prompt('请输入你要去掉的饭(每次去掉一个)：');
		let strArray = $('#list').val().indexOf(removeFood);
		if(strArray>=0){
			$('#list').val().replace(removeFood+" ","");
			alert('去除成功！');
		}else{
			alert('没有找到该饭，请放心开始！');
		}
	})

	//登录悬浮
    $('.index_user_headr').on('mouseenter',function(){
        $('.index_userMe').addClass('index_user_headerHover');
        $('.index_user_exit').stop().slideDown(200,function(){});

    }).on('mouseleave',function(){
        $('.index_user_exit').stop().slideUp(200,function(){
            $('.index_userMe').removeClass('index_user_headerHover');
        });
        
    })
});