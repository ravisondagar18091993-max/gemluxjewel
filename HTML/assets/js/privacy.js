$(document).ready(function () {
    var links = $("#quick-links a");

    links.first().parent().addClass("active");

    $(window).scroll(function () {
        var fromTop = $(this).scrollTop() + 205;

        links.each(function () {
            var section = $($(this).attr("href"));

            if (section.length) {
                if (
                    section.offset().top <= fromTop &&
                    section.offset().top + section.outerHeight() > fromTop
                ) {
                    links.parent().removeClass("active");
                    $(this).parent().addClass("active");
                }
            }
        });
    });
});