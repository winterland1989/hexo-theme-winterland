(function($){
    var slideLoaded = false;
    var slideShown = false;
    var slider;
    var experimentButton = $('a[href="/#experiment"]');
    experimentButton.attr("href", "#experiment");
    var experimentWrapper = $('#experiment_wrapper');
    experimentButton.click(function() {
        if(!slideLoaded){        
            experimentWrapper.css('max-height', '361px');
            experimentWrapper.slideDown(800,function(){   
                experimentWrapper.css('max-height', '361px');
            });
            slider = $('#slide_wrapper').bxSlider({
                slideWidth: 480,                
                slideMargin: 10,
                minSlides: 1.2,
                maxSlides: 2,
                moveSlides: 1,
                pagerSelector: '#slide_pager',
                onSliderLoad: function(){                    
                    slideLoaded = true;
                    var wrapperHeight = $('#experiment').outerHeight();
                    experimentWrapper.css('max-height', wrapperHeight + 'px');
                }
            });
        }else{
            experimentWrapper.slideDown(800);
        }        
	    slideShown = true;
    });
    
    $('#experiment_close').click(function() {
        experimentWrapper.stop().slideUp(800);
        slideShown = false;
    });

    $(window).resize(function(){
	    if(!slideShown && slideLoaded){            
            slideLoaded = false;
            slider.destroySlider();
        }
    });
    
})(jQuery);
