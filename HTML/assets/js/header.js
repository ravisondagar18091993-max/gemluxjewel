$(document).ready(function () {

    // header fixed js
    var prevScrollPos = window.pageYOffset || document.documentElement.scrollTop;
    $(window).scroll(function () {
        var currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;
        if (prevScrollPos > currentScrollPos || currentScrollPos === 0) {
            $(".header").removeClass("hidden");
        } else {
            $(".header").addClass("hidden");
        }
        prevScrollPos = currentScrollPos;
    });

    // MOBILE MENU
    $('.burger-menu a').on('click', function (e) {
        e.preventDefault();
        $('#mobileMenu').addClass('active');
        $('html').addClass('overflow-hidden');
    });

    $('.close-menu-btn, .mobile-nav-link').on('click', function (e) {
        $('#mobileMenu').removeClass('active');
        $('html').removeClass('overflow-hidden');
    });

});