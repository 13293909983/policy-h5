$(function() {
	//头部
	$('header').load('/static/html/header.html');
	//底部
	$('footer').load('/static/html/footer.html');
	$('.fixed').load('/static/html/fixedtop.html');
	$('.tiaokuan').load('/static/html/tiaokuan.html');

});
(function(doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function() {

			var userAgent = navigator.userAgent;
			var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
			if(isIE) {
				var clientWidth = docEl.clientWidth;
				if(!clientWidth) return;
				if(clientWidth > 1921) clientWidth = 1921;
				docEl.style.fontSize = 10 * (clientWidth / 190) + 'px';
			} else {
				var clientWidth = docEl.clientWidth,
					resolution = screen.width,
					width = docEl.dataset.width || 1921;
				if(!clientWidth || clientWidth > width) {
					//docEl.style.width = width + 'px';
					//docEl.style.fontSize = '12px';
					docEl.style.fontSize = '100px';
					docEl.style.margin = '0 auto';
				} else if(clientWidth < width && clientWidth > 1366) {
					//docEl.style.width = clientWidth + 'px';
					docEl.style.fontSize = (clientWidth / width) * 100 + 'px';
				} else {
					//docEl.style.width = clientWidth + 'px';
					docEl.style.fontSize = (1366 / width) * 100 + 'px';
				}
			}
		};
	if(!win.addEventListener) return;
	recalc();
	win.addEventListener(resizeEvt, recalc, false);

})(document, window);
$(function() {
	showSlide();

	function showSlide() {
		showInterval = setInterval(function() {
			$('.lipei_center_ul').animate({
				'margintop': '-4rem'
			}, 3000, function() {
				$(this).find('.lipei_center_content').eq($(this).index() + 1).addClass('animated bounceInRight active').siblings().removeClass('active');
				$(this).find('.lipei_center_content').eq(0).appendTo($(this));
				$(this).css({
					'margintop': '0'
				})
			})
		}, 4000)
	}
	$('.lipei_center_ul').hover(function() {
		clearInterval(showInterval)
	}, function() {
		showSlide();
	});

})