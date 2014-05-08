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
    
    $("#wrapper .string-button").click(function(){
        var string = "#wrapper #" + ($(this).attr("id").substring(0,1)) + "string" ;
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

    $("#wrapper .all-button").click(function(){
        for(var i =1;i<=6;i++){
            var string = "#wrapper #" + i + "string" ;
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

    $("#wrapper .string").hover(function(){
        if( $(this).attr("playing") != "true"){
            $(this).css("color","#aaa");
        }
    },function(){
        if( $(this).attr("playing") != "true"){
            $(this).css("color","#222");
        }
    });
    
    $("#wrapper .string").click(function(){
        if( $(this).attr("playing") != "true"){
            $("#wrapper .string").css("color","#222");
            $("#wrapper .string").attr("playing","false");
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
                $("#wrapper .string").css("color","#222");
                $("#wrapper .string").attr("playing","false");
            },1000)
        }
    });


    // Create function that routes an OscillatorNode through a GainNode and then to the output
    function startOsc(frequency){ // Frequency is passed to this function from input button 
     
        // Create OscillatorNode
        oscillator = context.createOscillator(); // Create sound source
        oscillator.type = 3; // Triangle wave
        oscillator.frequency.value = frequency; // Frequency in hertz (passed from input button)
        oscillator.noteOn(0); // Play oscillator instantly
        
        // Create GainNode    
        gain = context.createGainNode(); // Create gain node
        gain.gain.value = 1; // Set gain to full volume
     
        // Connect the Nodes
        oscillator.connect(gain); // Connect oscillator to gain
        gain.connect(context.destination); // Connect gain to output
     
    };

    function offOsc() {
        oscillator.noteOff(0); // Stop oscillator after 0 seconds
        oscillator.disconnect(); // Disconnect oscillator so it can be picked up by browser¡¯s garbage collector
    }

    $(".combo-button").click(function(){
        var notes = $(this).attr("notes").split(" ")
        for(var i = 1; i<=6; i++){
            var string = "#wrapper #" + i + "string" ;
            $(string).children("span").text(notes[i-1]);
        }
    });

//--------------------------------------metronome-------------------------------------//
var container = $("#wrapper3");
var m_canvas = $("#metronome-canvas");

var m_width = 0;



$(window).resize( respondCanvas );

respondCanvas();

function respondCanvas(){ 
    m_width =  $(container).width();
    $(container).height(m_width);
    

    m_canvas.attr('width', m_width ); //max width
    m_canvas.attr('height',m_width); //max height


    redraw();
}

function redraw(){
var ctx = m_canvas.get(0).getContext("2d");
ctx.lineWidth = m_width*0.1;
ctx.strokeStyle = '#ccc';
ctx.beginPath();
ctx.arc(m_width/2,m_width/2,m_width*0.4,0,2*Math.PI);
ctx.stroke();
ctx.closePath();

ctx.strokeStyle = '#999';
ctx.beginPath();
ctx.arc(m_width/2,m_width/2,m_width*0.3,0,2*Math.PI);
ctx.stroke();
ctx.closePath();
}

//--------------------------------------other-------------------------------------//

})(jQuery);

