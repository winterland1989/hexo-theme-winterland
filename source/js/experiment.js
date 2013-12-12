(function($){
    var slideLoaded = false;
    var slideShown = false;
    var slider;
    experimentButton = $('a[href="/#experiment"]');
    experimentButton.attr("href", "#experiment");
    experimentWrapper = $('#experiment_wrapper');
    experimentButton.click(function() {
        experimentWrapper.slideDown(800);
        $("html, body").animate({ scrollTop: 0 });
        if(!slideLoaded){
            slideLoaded = true;
            slider = $('#slide_wrapper').bxSlider({
                slideWidth: 480,                
                slideMargin: 10,
                minSlides: 1.2,
                maxSlides: 2,
                moveSlides: 1,
                pagerSelector: '#slide_pager'
            });
        }
	    slideShown = true;
    });
    
    $('#experiment_close').click(function() {
        experimentWrapper.stop().slideUp(800);
        slideShown = false;
    });

    $(window).resize(function(){
	    if(!slideShown){            
            slideLoaded = false;
            slider.destroySlider();
        }
    });
    
})(jQuery);
