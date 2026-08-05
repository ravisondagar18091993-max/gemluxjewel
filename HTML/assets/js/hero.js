$(document).ready(function() {
    var time = 5000; 
    var $bar = $('.progress-fill');
    var $previewImg = $('#preview-img'); 
    var $slider = $('.hero-slider');

    function startProgressbar() {
        $bar.css({ width: "0%" }); 
        $bar.animate({ width: "100%" }, time, "linear"); 
    }

    $slider.slick({
        autoplay: true,
        autoplaySpeed: time,
        pauseOnHover: false, 
        pauseOnFocus: false,
        arrows: false,
        fade: true, 
    });

    startProgressbar();

    $slider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        $bar.stop(true, true).css({ width: "0%" });
        
        var nextPreviewIndex = nextSlide + 1;
        
        if (nextPreviewIndex >= slick.slideCount) {
            nextPreviewIndex = 0; 
        }
        
        var nextImgSrc = $(slick.$slides[nextPreviewIndex]).find('img').attr('src');
        
        $previewImg.fadeOut(250, function() {
            $(this).attr('src', nextImgSrc).fadeIn(250);
        });
    });

    $slider.on('afterChange', function(event, slick, currentSlide) {
        startProgressbar();
    });
});