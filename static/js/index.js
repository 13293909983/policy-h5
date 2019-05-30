/**
 * Created by Administrator on 2017/3/7.
 */
;$(function () {
    //头部
    $('header').load('/html/header.html');
    //底部
    $('footer').load('/html/footer.html');
    $(".list_wrap_w").click(function() {
    	$(this).addClass("list_active").siblings().removeClass("list_active");
    	$(".main_wrap_o").eq($(this).index()).addClass("main_wrap_active").siblings().removeClass("main_wrap_active");
    })
    var testdata = 1;
    showSlide();

    function showSlide() {
    	showInterval = setInterval(function() {
    		$('.new_list').animate({
    			'marginLeft': '-6.2rem'
    		}, 2000, function() {
    			$(this).find('.about-grid').eq(0).appendTo($(this));
    			$(this).css({
    				'marginLeft': '-2rem'
    			})
    		})

    	}, 3000)

    }
    $('.new_list').hover(function() {
    	clearInterval(showInterval)
    }, function() {
    	showSlide();
    });
    $('.about-grid').click(function() {
    	//window.location.href="http://127.0.0.1:8020/wxkc/news.html";


    });
$(".sub_wrap").click(function (){
    if($(".demo-txt").css("display")=="none"){
        $(".demo-txt").show();
    }
});
$(".btn_op").click(function (){
    if($(".demo-txt").css("display")=="block"){
        $(".demo-txt").hide();
    }
});

var timer = null,imgIndex = 0;
	    interval();
        function interval(){
            timer = setInterval(function(){
                $('.img_box').animate({
                    'marginLeft':'-5.30rem'
                },1000,function(){
                    $(this).find('.img_li').eq(0).appendTo( $(this));
                    $(this).css({
                        'marginLeft':'0px'
                    })
                })
            },2000)
        }

 $('.next').click(function(){
            $('.img_box:not(:animated)').animate({
                'marginLeft':'-5.30rem'
            },1000,function(){
                $(this).find('.img_li').eq(0).appendTo( $(this));
                $(this).css({
                    'marginLeft':'0'
                })
            })
        });
        $('.pre').click(function(){
            $('.img_box:not(:animated)').find('.img_li').last().prependTo( $('.img_box'));
                $('.img_box:not(:animated)').css({'marginLeft':'-5.30rem'});
            $('.img_box:not(:animated)').animate({'marginLeft':'0'},1000)
            });
 
	   $('.pre,.next').mouseleave(function(){
            interval();
        }).mouseenter(function () {
            clearInterval(timer);
        });
    });

(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {

            var userAgent = navigator.userAgent;
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
            if (isIE) {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                if (clientWidth > 1921) clientWidth = 1921; 
                docEl.style.fontSize = 10 * (clientWidth / 190) + 'px';
            } else {
                var clientWidth = docEl.clientWidth,
                    resolution = screen.width,
                    width = docEl.dataset.width || 1921;
                if (!clientWidth || clientWidth > width) {
                    //docEl.style.width = width + 'px';
                    //docEl.style.fontSize = '12px';
                    docEl.style.fontSize = '100px';
                    docEl.style.margin = '0 auto';
                } else if (clientWidth < width && clientWidth > 1366) {
                    //docEl.style.width = clientWidth + 'px';
                    docEl.style.fontSize = (clientWidth / width) * 100 + 'px';
                } else {
                    //docEl.style.width = clientWidth + 'px';
                    docEl.style.fontSize = (1366 / width) * 100 + 'px';
                }
            }
        };
    if (!win.addEventListener) return;
    recalc();
    win.addEventListener(resizeEvt, recalc, false);
})(document, window);