(function($){
    var Notes = new Array( 
        "E1", "F1", "F1#", "G1", "G1#", "A1", "A1#", "B1", "C2", "C2#", "D2", "D2#",
        "E2", "F2", "F2#", "G2", "G2#", "A2", "A2#", "B2", "C3", "C3#", "D3", "D3#",
        "E3", "F3", "F3#", "G3", "G3#", "A3", "A3#", "B3", "C4", "C4#", "D4", "D4#",
        "E4", "F4", "F4#", "G4", "G4#", "A4", "A4#", "B4", "C5", "C5#", "D5", "D5#"
    );

    var NotesFreq = new Array( 
        41.2, 43.65, 46.25, 49.0, 51.9, 55.0, 58.25, 61.75, 65.4, 69.3, 73.4, 77.8,
        82.4, 87.3, 92.5, 98.0, 103.8, 110.0, 116.5, 123.5, 130.8, 138.6, 146.8, 155.6,
        164.8, 174.6, 185.0, 196.0, 207.6, 220.0, 233.1, 246.9, 261.6, 277.2, 293.6, 311.1, 
        329.6, 349.2, 370,0, 392.0, 415.3, 440.0, 466.1, 493.8, 523.2, 554.3, 587.3, 622.2
    );

    var context; // Create audio container
    var usingWebAudio = true;

    if (typeof AudioContext !== 'undefined') {
      context = new AudioContext();
    } else if (typeof webkitAudioContext !== 'undefined') {
      context = new webkitAudioContext();
    } else {
      usingWebAudio = false;
    }

    var oscillator;
    var oscillatorTimeoutHandler;
    var textTimeoutHandler;

    $("#wrapper1 .string-button").click(function(){
        var string = "#wrapper1 #" + ($(this).attr("id").substring(0,1)) + "string" ;
        var note = Notes.indexOf( $(string).children("span").text() );
        
        if( $(this).attr("id").substring(8) == "down" ){
            if ( note > 0  ){
                $(string).children("span").text( Notes[note - 1] );
            }
        }
        else{
            if( note < Notes.length - 1 ){
                $(string).children("span").text( Notes[note + 1] );
            }
        }
        
    });

    $("#wrapper1 .all-button").click(function(){
        for(var i =1;i<=6;i++){
            var string = "#wrapper1 #" + i + "string" ;
            var note = Notes.indexOf( $(string).children("span").text() );
            
            if( $(this).attr("id").substring(4) == "down" ){
                if ( note > 0  ){
                    $(string).children("span").text( Notes[note - 1] );
                }
            }
            else{
                if( note < Notes.length - 1 ){
                    $(string).children("span").text( Notes[note + 1] );
                }
            }
        }
    });

    $("#wrapper1 .string").hover(function(){
        if( $(this).attr("playing") != "true"){
            $(this).css("color","#aaa");
        }
    },function(){
        if( $(this).attr("playing") != "true"){
            $(this).css("color","#222");
        }
    });

    $("#wrapper1 .string").click(function(){
        if( $(this).attr("playing") != "true"){
            $("#wrapper1 .string").css("color","#222");
            $("#wrapper1 .string").attr("playing","false");
            if(oscillator) {
                offOsc();
                clearTimeout(oscillatorTimeoutHandler);
                clearTimeout(textTimeoutHandler);
            }
            $(this).css("color","red");
            $(this).attr("playing","true");
           
            var note = Notes.indexOf( $(this).children("span").text() );
            startOsc(NotesFreq[note]); // frequency in hertz
            oscillatorTimeoutHandler = setTimeout(offOsc,1000);

            textTimeoutHandler = setTimeout(function(){                
                $("#wrapper1 .string").css("color","#222");
                $("#wrapper1 .string").attr("playing","false");
            },1000)
        }
    });


    // Create function that routes an OscillatorNode through a GainNode and then to the output
    function startOsc(frequency){ // Frequency is passed to this function from input button 
     
        // Create OscillatorNode
        oscillator = context.createOscillator(); // Create sound source
        oscillator.type = 3; // Triangle wave
        oscillator.frequency.value = frequency; // Frequency in hertz (passed from input button)
        oscillator.start(0); // Play oscillator instantly
        
        // Create GainNode    
        gain = context.createGain (); // Create gain node
        gain.gain.value = 1; // Set gain to full volume
     
        // Connect the Nodes
        oscillator.connect(gain); // Connect oscillator to gain
        gain.connect(context.destination); // Connect gain to output
     
    };

    function offOsc() {
        oscillator.stop(0); // Stop oscillator after 0 seconds
        oscillator.disconnect(); // Disconnect oscillator so it can be picked up by browser¡¯s garbage collector
    }

    $(".combo-button").click(function(){
        var notes = $(this).attr("notes").split(" ")
        for(var i = 1; i<=6; i++){
            var string = "#wrapper1 #" + i + "string" ;
            $(string).children("span").text(notes[i-1]);
        }
    });

    //--------------------------------------metronome-------------------------------------//
    var container = $("#wrapper3");
    var m_canvas = $("#metronome-canvas");
    var ctx = m_canvas.get(0).getContext("2d");
    var m_width = 0;
    var muted = 0;
    var speed = 50;

    var ring_pos = 0;
    var angle = 0.0;
    var ring2_list = [];
    var ring1_list = [];
    var ring2_triger_pre = 0;
    var ring2_triger = 0;
    var ring1_triger_pre = 0;
    var ring1_triger = 0;

    var bass_audio = document.getElementById("Bass");
    bass_audio.addEventListener('ended', function(){
        this.currentTime = 0 ;
        ring2_triger = 0;
        ring2_playing = 0;
    });

    var cymbal_audio = document.getElementById("Snear");


    $(window).resize( respondCanvas );

    respondCanvas();

    function respondCanvas(){ 
        m_width =  $(container).width();
        $(container).height(m_width);    

        m_canvas.attr('width', m_width ); //max width
        m_canvas.attr('height',m_width); //max height
    }

    window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
    })();

    function animate() {
        var start = new Date().getTime();

        // Clear
        //Ring 2
        ctx.lineWidth = m_width*0.1;
        ctx.strokeStyle = '#dedede';
        ctx.beginPath();
        ctx.arc(m_width/2,m_width/2,m_width*0.4,0,2*Math.PI);
        ctx.stroke();
        ctx.closePath();
        //Ring 1
        ctx.strokeStyle = '#ccc';
        ctx.beginPath();
        ctx.arc(m_width/2,m_width/2,m_width*0.3,0,2*Math.PI);
        ctx.stroke();
        ctx.closePath();
        ////Ring 0
        ctx.lineWidth = m_width*0.3;
        ctx.strokeStyle = '#eee';
        ctx.beginPath();
        ctx.arc(m_width/2,m_width/2,m_width*0.15,0,2*Math.PI);
        ctx.stroke();
        ctx.closePath();

        //draw text
        ctx.font="80px Poiret One";
        ctx.fillStyle="#999";
        ctx.textAlign="center";
        ctx.fillText(speed,m_width/2,m_width/2+28);


        // draw stuff
        var drawing_speed = start/10000*speed;
        //draw moving dot
        ctx.lineWidth = m_width*0.02;
        ctx.strokeStyle = '#999';
        ctx.beginPath();
        ctx.arc(m_width/2 + m_width*0.2*Math.sin(drawing_speed - Math.PI) , m_width/2 + m_width*0.2*Math.cos(drawing_speed) , m_width*0.01, 0, 2*Math.PI);
        ctx.stroke();
        ctx.closePath();

        //draw ring 2
        if (ring_pos == 2){
            ctx.lineWidth = m_width*0.04;
            ctx.strokeStyle = '#999';
            ctx.beginPath();
            ctx.arc(m_width/2 + m_width*0.4*Math.sin(angle) , m_width/2 + m_width*0.4*Math.cos(angle) , m_width*0.02, 0, 2*Math.PI);
            ctx.stroke();
            ctx.closePath();
        }
        ring2_triger =0;
        for(var i=0; i<ring2_list.length; i++){
            if(  2*Math.PI-(drawing_speed+Math.PI)%(2*Math.PI) < ring2_list[i] + Math.PI +0.2 && 2*Math.PI-(drawing_speed+Math.PI)%(2*Math.PI) > ring2_list[i] + Math.PI  - 0.2 )
            {
                ctx.strokeStyle = '#fff';
                ring2_triger = 1;
            }
            else {
                ctx.strokeStyle = '#999';
            }        
            ctx.lineWidth = m_width*0.04;
            ctx.beginPath();
            ctx.arc(m_width/2 + m_width*0.4*Math.sin(ring2_list[i]) , m_width/2 + m_width*0.4*Math.cos(ring2_list[i]) , m_width*0.02, 0, 2*Math.PI);
            ctx.stroke();
            ctx.closePath();
        }

        //make ring2 sound
        if( ring2_triger - ring2_triger_pre == 1 && muted == 0){
            bass_audio.currentTime=0;
            bass_audio.play(); 
        }
        ring2_triger_pre = ring2_triger;
        
        //draw ring 1
        if (ring_pos == 1){
            ctx.lineWidth = m_width*0.03;
            ctx.strokeStyle = '#999';
            ctx.beginPath();
            ctx.arc(m_width/2 + m_width*0.3*Math.sin(angle) , m_width/2 + m_width*0.3*Math.cos(angle) , m_width*0.015, 0, 2*Math.PI);
            ctx.stroke();
            ctx.closePath();
        }
        ring1_triger = 0;
        for(var i=0; i<ring1_list.length; i++){
            if(  2*Math.PI-(drawing_speed+Math.PI)%(2*Math.PI) < ring1_list[i] + Math.PI + 0.2 && 2*Math.PI-(drawing_speed+Math.PI)%(2*Math.PI) > ring1_list[i] + Math.PI - 0.2 )
            {
                ctx.strokeStyle = '#fff';
                ring1_triger = 1;
            }
            else {
                ctx.strokeStyle = '#999';
            }        
            ctx.lineWidth = m_width*0.03;
            ctx.beginPath();
            ctx.arc(m_width/2 + m_width*0.3*Math.sin(ring1_list[i]) , m_width/2 + m_width*0.3*Math.cos(ring1_list[i]) , m_width*0.015, 0, 2*Math.PI);
            ctx.stroke();
            ctx.closePath();
        }
        //make ring1 sound
        if( ring1_triger - ring1_triger_pre == 1 && muted == 0){
            cymbal_audio.currentTime = 0;
            cymbal_audio.play(); 
        }
        ring1_triger_pre = ring1_triger;
        // request new frame
        requestAnimFrame(function() {
          animate();
        });
    }

    animate();

    m_canvas.get(0).addEventListener('mousemove', function(evt){
            var mousePos = getMousePos(m_canvas.get(0), evt);
            radius_square = (mousePos.x - m_width/2 )*(mousePos.x - m_width/2 ) + (mousePos.y - m_width/2 )*(mousePos.y - m_width/2 )
            ring_pos = 0;
            if ( radius_square < m_width*0.45*m_width*0.45 && radius_square > m_width*0.35*m_width*0.35 )
            ring_pos = 2;
            else if ( radius_square < m_width*0.35*m_width*0.35 && radius_square > m_width*0.25*m_width*0.25 )
            ring_pos = 1;    

            angle = Math.floor( Math.atan2( mousePos.x - m_width/2, mousePos.y - m_width/2  ) / (Math.PI/36) )*(Math.PI/36);
                
          }, false);


    m_canvas.get(0).addEventListener('click', function(evt){
            if(ring_pos ==2)
            ring2_list.push(angle);
            else if(ring_pos ==1)
            ring1_list.push(angle);
          }, false);
          
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }
    $("#metronome-play").click(function(){
        $(this).toggleClass("metronome-play-stop");
        muted = 1 - muted;
    });
    $("#metronome-slow").click(function(){
        if(speed>10) speed--;
    });
    
    $("#metronome-fast").click(function(){
        if(speed<99) speed++;
    });
    
    
    $("#metronome-reset").click(function(){
        ring2_list = [];
        ring1_list = [];
    });
    //--------------------------------------other-------------------------------------//

})(jQuery);

