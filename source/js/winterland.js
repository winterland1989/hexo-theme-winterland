(function($){
    var canvasDiv = $('#winterland');
    var canvas = canvasDiv.children('canvas')[0];
    var ctx = canvas.getContext("2d");
    
    //canvas dimensions
    var W = canvas.width = canvasDiv.width();
    var H = canvas.height = canvasDiv.height();
    
    //snowflake particles
    var mp = W*H/3200;  //max particles
    var particles = [];
    for(var i = 0; i < mp; i++)
    {
        particles.push({
            x: Math.random()*2*W-W/2, //x-coordinate
            y: Math.random()*H, //y-coordinate
            r: Math.random()*4+1, //radius
            d: Math.random()*mp //density
        })
    }

    requestAnimationFrame = window.requestAnimationFrame || 
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback) { setTimeout(callback, 1000 / 60); };
    
    //Lets draw the flakes
    function draw()
    {
        ctx.clearRect(0, 0, W, H);
        
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.beginPath();
        for(var i = 0; i < mp; i++)
        {
                var p = particles[i];
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
        }
        ctx.fill();
        update();
        requestAnimationFrame(draw);
    }
    
    //Function to move the snowflakes
    //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
    var angle = 0.000;
    var speed = 0.5;
    function update()
    {
        if(angle > 2*Math.PI)
        angle = 0.000;
        angle += 0.002;
        for(var i = 0; i < mp; i++)
        {
            var p = particles[i];
            //Updating X and Y coordinates
            //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
            //Every particle has its own density which can be used to make the downward movement different for each flake
            //Lets make it more random by adding in the radius
            p.y += (Math.cos(angle+p.d) + 1 + p.r/2)*speed;
            p.x += (Math.sin(angle) * 2)*speed;
            
            //Sending flakes back from the top when it exits
            //Lets make it a bit more organic and let flakes enter from the left and right also.
            if(p.x > W*1.5 || p.x < -0.5*W || p.y > H)
            {
                particles[i] = {x: Math.random()*2*W-W/2, y: -10, r: p.r, d: p.d};            

            }
        }
    }
    
    //start animation loop
    draw();
    
    $(window).resize(function(){
        W = canvas.width = canvasDiv.width();
        H = canvas.height = canvasDiv.height();
        mp = W*H/3200;  //max particles
        particles = [];
        for(var i = 0; i < mp; i++)
        {
            particles.push({
                    x: Math.random()*2*W-W/2, //x-coordinate
                    y: Math.random()*H, //y-coordinate
                    r: Math.random()*4+1, //radius
                    d: Math.random()*mp //density
            })
        }
        update();
    });

})(jQuery);
