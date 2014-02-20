(function($){
    $("#timeline .blockWrapper").mouseenter(function() {
        var icon = $(this).children("img");
        var alterSrc = icon.attr('alter');
        icon.attr('alter',icon.attr('src'));
        icon.attr('src',alterSrc);          
        icon.animate({ right:'135px'}, 500 );
        $(this).animate({width:'360px'},500, function(){
            $(this).children(".content").toggle();
        });
    

        
    });
    
    $("#timeline .blockWrapper").mouseleave(function() {
        var icon = $(this).children("img");
        var alterSrc = icon.attr('alter');
        icon.attr('alter',icon.attr('src'));
        icon.attr('src',alterSrc);
          
        $(this).children(".content").toggle();
        icon.animate({ right:'0'}, 500 );
        $(this).animate({width:'90px'},500, function(){  
        });
        
        
    });


})(jQuery);
