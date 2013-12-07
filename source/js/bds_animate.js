(function($){
    var windowObject = $(window);
    // Check if bdshare's loaded 
    function BD_wait() 
    { 
        if( !$('#bdshare').length ) 
        { 
            window.setTimeout(BD_wait,100); 
        } 
        else 
        {       
            var bdshare = $('#bdshare'); 
            bdshare.children('img').click(function() {
                window.setTimeout(BD_pop_wait,100); 
            });
            bdshare.find('.bds_more').click(function() {
                window.setTimeout(BD_pop_wait,100); 
            });
            var windowpos = $(window).scrollTop(); 
                bdshare.stop().animate({"marginTop": (windowObject.scrollTop() ) + "px"}, 300 );
            
            $(window).scroll(function(){
                var elpos = bdshare.offset().top;               
                bdshare.stop().animate({"marginTop": (windowObject.scrollTop() ) + "px"}, 300 );                
                if( $('#bdshare_pop').length ) {
                    var bdshare_pop = $('#bdshare_pop'); 
                    bdshare_pop.stop().animate({"marginTop": (windowObject.scrollTop() ) + "px"}, 300 );
                }                
            });
        } 
    } 
    function BD_pop_wait(){
        if( !$('#bdshare_pop').length ) 
        { 
            window.setTimeout(BD_wait,100); 
        } 
        else{
            var bdshare_pop = $('#bdshare_pop'); 
            bdshare_pop.stop().animate({"marginTop": (windowObject.scrollTop() ) + "px"}, 300 );
        }    
    }
    BD_wait();
})(jQuery);