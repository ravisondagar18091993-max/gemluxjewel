$(document).ready(function () {
    $(".header-top-slider").slick({
        dots: false,
        infinite: true,
        speed: 5000,
        slidesToShow: 6,
        slidesToScroll: 1,
        cssEase: 'linear',
        autoplaySpeed: 0,
        autoplay: true,
        arrows: false,
        centerMode: true,
        responsive: [
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 525,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    });

    $(".marquee-slider").slick({
        dots: false,
        infinite: true,
        speed: 6000,
        slidesToShow: 5,
        slidesToScroll: 1,
        cssEase: 'linear',
        autoplaySpeed: 0,
        autoplay: true,
        arrows: false,
        centerMode: true,
        responsive: [
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 525,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    });

    $('.marquee-track').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 10000,
        cssEase: 'linear',
        infinite: true,
        arrows: false,
        dots: false,
        pauseOnHover: false,
        pauseOnFocus: false,
        variableWidth: true,
    });


    // Our History Slider
    $('.history-slider').slick({
        slidesToShow: 4,    
        slidesToScroll: 1,
        autoplay: false,     
        arrows: false,    
        dots: false,   
        infinite: false,  
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });
    $('.insta-post-slider').slick({
        slidesToShow: 5,    
        slidesToScroll: 1,
        autoplay: false,     
        arrows: false,    
        dots: false,   
        infinite: false,  
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                  
                }
            }
        ]
    });
    $('.category-slider').slick({
        slidesToShow: 6,    
        slidesToScroll: 1,
        autoplay: false,     
        arrows: false,    
        dots: false,   
        infinite: false,  
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                  
                }
            }
        ]
    });

});
