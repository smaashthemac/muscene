$(document).ready(function() {
		$window = $(window);

		// parallax
		$(window).scroll(function() {
			var yPos = -($window.scrollTop() / $('#parallax').data('speed') - 280);
			// Put together our final background position
			var coords = '50%' + yPos + 'px';
			// Move the background
			$('#parallax').css({
				backgroundPosition: coords
			});
		});

		//when top hits the first cta btn, run this 
		$(".cont-wrapper .btn-wrp").waypoint(function() {
			$(".ipad").addClass("anim");
			$(".text").addClass("anim");
		});

		// artists
		$(".staff-mem").hover(
		function() {
			$(this).addClass("anim");
		}, function() {
			$(this).removeClass("anim");
		});

		// navigation

		$("#navigation li").click(function(){
			$("#navigation li ").removeClass("active");
			$(this).addClass("active");
		});

		$("nav").onePageNav({
			changeHash: false,
			scrollSpeed: 750,
			scrollOffset: 5
		});

		$('#navigation').scrollspy();

		$(".post").hover(
		function() {
			$(".post-pic", this).children("img").addClass("anim");
		}, function() {
			$(".post-pic", this).children("img").removeClass("anim");
		});

		$("a.mini-nav").click(function(){
			$("ul.nav").slideToggle("slow");
			return false;
		});

		$("ul.nav li").click(function(){
/*
			$("ul.nav").slideToggle();
			return false;
*/
		});
});