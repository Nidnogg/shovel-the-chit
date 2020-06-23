// for legacy browsers
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// get the audio element
const audioElement = document.querySelector('audio');

// pass it into the audio context
const track = audioContext.createMediaElementSource(audioElement);
var analyser = audioContext.createAnalyser();
track.connect(analyser);
analyser.fftSize = 256;

//init dataArray for analysing and displaying audio freqs
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

const gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);

track.connect(gainNode);

gainNode.gain.value = 1.0;
// select our play button
const playButton = document.querySelector('button');

playButton.addEventListener('click', function() {

    // check if context is in suspended state (autoplay policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // play or pause track depending on state
    if (this.dataset.playing === 'false') {
        audioElement.play();
        this.dataset.playing = 'true';
    } else if (this.dataset.playing === 'true') {
        audioElement.pause();
        this.dataset.playing = 'false';
    }

}, false);

audioElement.addEventListener('ended', () => {
  playButton.dataset.playing = 'false';
}, false);

// select our volume button
const volumeValue = document.getElementById('volume');
const volumeDial = document.getElementById('volume_dial');
const volumeSvg = document.getElementById('volume_svg');
const volumeSvgDiv = document.getElementById('volume_svg_div');

const moveSlider = e => {
    //console.log((e.target.value * 10.0)/360.0);

    if(audioContext) { 
        let scaledVolume = (e.target.value * 10.0)/360.0;
        gainNode.gain.value = scaledVolume;
    }
}

volumeDial.addEventListener('input', moveSlider);

let svgMouseDowned = false; 

const startSvgRotation = () => {
    //console.log(`startSvGRotation mouse downed ${svgMouseDowned}`)
    svgMouseDowned = true;
    //console.log(svgMouseDowned);
    // rotation
    //let deg = volumeDial.
    //volumeSvg.style.transform       = 'rotate('+deg+'deg)'; 
    /* volumeSvg.style.webkitTransform = 'rotate('+deg+'deg)'; 
     volumeSvg.style.mozTransform    = 'rotate('+deg+'deg)'; 
     volumeSvg.style.msTransform     = 'rotate('+deg+'deg)'; 
     volumeSvg.style.oTransform      = 'rotate('+deg+'deg)'; */
    //console.log(document.body.clientWidth); 
    //console.log(document.body.clientHeight);
}

volumeSvg.addEventListener("mousedown", startSvgRotation);


let cursor_direction = "";
let old_x = 0
let old_y = 0
let deg = 200;  // Default value for degree 

const doSvgRotation = e => {

    if(svgMouseDowned == true) {
        //console.log(`doSvGRotation mouse downed ${svgMouseDowned}`)
        // last and final fix

        let mouse_x = event.clientX;     // Get the horizontal mouse coordinate
        let mouse_y = event.clientY;     // Get the vertical mouse coordinate

        if (e.pageY < old_y ) {
            direction="pos!";
            console.log(direction);
            if(deg < 354) {
                deg+=6.0;
                volumeSvg.style.transform       = 'rotate('+deg+'deg)'; 

                if(audioContext) { // control the volume
                    let scaledVolume = (deg * 10.0)/360.0;
                    gainNode.gain.value = scaledVolume;
                }
            }  
        }
        if (e.pageY > old_y) {
            direction="neg!";
            console.log(direction);
            if(deg > 6) {
                deg-=6.0;
                volumeSvg.style.transform       = 'rotate('+deg+'deg)'; 
    
                if(audioContext) { 
                    let scaledVolume = (deg * 10.0)/360.0;
                    gainNode.gain.value = scaledVolume;
                }
            }
        }
  
        old_x = e.pageX;
        old_y = e.pageY;
        
        /*
        volumeSvg.style.transform       = 'rotate('+deg+'deg)'; 
        volumeSvg.style.mozTransform    = 'rotate('+deg+'deg)';
        */
       // volumeSvg.style.transform = "rotate(" + Math.atan2(event.clientY - svgY, event.clientX - svgX) + "rad)";

        /*
        // attempting to fix from fiddle http://jsfiddle.net/JqBZb/
        let mouse_x = event.clientX;     // Get the horizontal mouse coordinate
        let mouse_y = event.clientY;     // Get the vertical mouse coordinate

        console.log(`mouse_x ${mouse_x} and mouse_y ${mouse_y}`);

        let center_x = volumeSvgDiv.offsetLeft + volumeSvgDiv.offsetWidth / 2; 
        let center_y = volumeSvgDiv.offsetTop + volumeSvgDiv.offsetHeight / 2;
        
        let radCoords = Math.atan2(mouse_x - center_x, mouse_y - center_y);
        let deg = (radCoords * (180 / Math.PI) * -1) + 90; 
        console.log(deg);
        
        volumeSvg.style.transform       = 'rotate('+deg+'deg)'; 
        volumeSvg.style.mozTransform    = 'rotate('+deg+'deg)';
        */

        /* initial solution
        const radCoords = Math.atan2(x, y);      // Maps X and Y coordinates to rad
        let deg = radCoords * (180 / Math.PI);   // Converts rad to degrees
        console.log(deg);
        volumeSvg.style.transform       = 'rotate('+deg+'deg)'; 
        volumeSvg.style.mozTransform    = 'rotate('+deg+'deg)';
        volumeSvg.style.webkitTransform = 'rotate('+deg+'deg)'; 
        volumeSvg.style.mozTransform    = 'rotate('+deg+'deg)'; 
        volumeSvg.style.msTransform     = 'rotate('+deg+'deg)'; 
        volumeSvg.style.oTransform      = 'rotate('+deg+'deg)'; */
    }
}

const stopSvgRotation = () => {
    //console.log(`stopSvGRotation mouse downed ${svgMouseDowned}`)
    if(svgMouseDowned == true) {
        svgMouseDowned = false;
        //old_x = volumeSvgDiv.offsetLeft + volumeSvgDiv.offsetWidth / 2;
        //old_y = volumeSvgDiv.offsetTop + volumeSvgDiv.offsetHeight / 2;
    } else {
        //console.log('nothing to do with svg');
    }
    //svgMouseDowned = false;
}
document.addEventListener('mousemove', doSvgRotation);
document.addEventListener('mouseup', stopSvgRotation);


// main canvas function
const canvas = document.getElementById('canvas');
/*
canvas.width = window.screen.availWidth; //document.body.clientWidth; 
canvas.height = window.screen.availHeight; //document.body.clientHeight;
*/
//canvas.width = window.screen.availWidth; //document.body.clientWidth; 
canvas.width = 525;
canvas.height = 255;
canvasW = canvas.width;
canvasH = canvas.height;

const ctxCanvas = canvas.getContext('2d');
const colorsArray = ['#4A4940', '#33322C', '#3D3C35', '#8A8878', '#C9C6AF', '#545445', '#464A3D', '#545145',
                     '#4A463D', '#3A3D32', '#45394A', '#392F3D', '#2F2C3D', '#364761', '#2D404A', '#4A4926'];
const shuffledColors = shuffle(colorsArray); //shuffles colors every refresh

//Main draw function for bar graphs
function draw(){
    var sliceWidth = bufferLength/16/2; //WARNING: 
    
    ctxCanvas.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);

    //16 rectangle loop
    for(let i = 0; i < 16; i++) {

        var sum = 0;
        for(let j = 0; j < sliceWidth; j++){
            sum += dataArray[j + i * sliceWidth];
        }
        sum = sum/sliceWidth/2;

        ctxCanvas.fillStyle = colorsArray[i];
        ctxCanvas.fillRect(i * 33, canvas.height, 30, -sum); // to view without pressing play change sum
    }
}
setInterval(draw, 16); //calls draw every X ms

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

