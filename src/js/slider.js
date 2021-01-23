/*Slick Slider*/
$(document).ready(function() {

    //License Slider

    $('.license-slider').slick({
        infinite: true,
        focusOnSelect: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: '<button class="slider-btn slider-btn__prev license-slider__prev"></button>',
        nextArrow: '<button class="slider-btn slider-btn__next license-slider__next"></button>',
        responsive: [

            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: false
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                }
            }
        ],
        autoplay: true,
        autoplaySpeed: 2000
    });

    //Review Slider

    $('.review-slider').slick({
        infinite: true,
        focusOnSelect: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: '<button class="slider-btn slider-btn__prev review-btn review-btn__prev"></button>',
        nextArrow: '<button class="slider-btn slider-btn__next review-btn review-btn__next"></button>',
        autoplay: true,
        autoplaySpeed: 2000
    });

    //Managers Slider

    $('.managers-slider').slick({
        infinite: true,
        focusOnSelect: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        responsive: [

            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: false
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                    arrows: true,
                    prevArrow: '<button class="slider-btn slider-btn__prev managers-slider__prev"></button>',
                    nextArrow: '<button class="slider-btn slider-btn__next managers-slider__next"></button>'
                }
            }
        ],
        autoplay: true,
        autoplaySpeed: 2000
    });
});
