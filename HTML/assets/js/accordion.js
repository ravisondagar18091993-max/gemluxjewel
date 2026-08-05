$(document).ready(function () {
	// $(".closet-header").first().addClass("active").next(".closet-content").slideDown();

	$(".closet-header").click(function () {
		$(this).toggleClass("active").next(".closet-content").slideToggle();
		$(".closet-header").not(this).removeClass("active").next(".closet-content").slideUp();


	});
});