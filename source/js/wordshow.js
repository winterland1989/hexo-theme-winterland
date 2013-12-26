(function($){
    $("#wordSliderLike").show();
    slider = $('#aboutWordSlider').bxSlider({
                mode: 'vertical',
                speed: 40,
                infiniteLoop: true,
                slideWidth: 320,                
                slideMargin: 10,
                pager: false,
                controls: false,
                onSliderLoad: function(){
                    setInterval(function(){
                        var jump = function(){slider.goToNextSlide( );};
                        for(var i = 0; i < slider.getSlideCount() + 1; i++){
                            setTimeout(jump,100*i);
                        }
                    },3000);
                }
            }); 

})(jQuery);
