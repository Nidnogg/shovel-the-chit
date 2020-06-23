// for legacy browsers
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// get the audio element
const audioElement = document.querySelector('audio');

/* Track select code ****************************************************************/ 

const track_select = document.querySelector('select');

track_select.addEventListener('change', e => {
    
    if(e.target.value == 'lo-fi') {
        audioElement.setAttribute('src', 'https://firebasestorage.googleapis.com/v0/b/cloudtop-8de79.appspot.com/o/serene_mind_waves.mp3?alt=media&token=dd379833-fe01-44da-a405-942cba30b3e2');
    }

    if(e.target.value == 'speedcore') {
        audioElement.setAttribute('src', 'https://firebasestorage.googleapis.com/v0/b/cloudtop-8de79.appspot.com/o/kuhnert_song_test.mp3?alt=media&token=cea62b08-1bfc-4bb7-bf32-bc91603b7a74');
    }

    if(e.target.value == 'jazz') {
        audioElement.setAttribute('src', 'https://firebasestorage.googleapis.com/v0/b/cloudtop-8de79.appspot.com/o/I_suspect_jazz.mp3?alt=media&token=5ba5c539-1cd6-47f0-9790-347445e8db6b');
    }
});

/* Track select code ****************************************************************/ 

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

/* Volume button code ****************************************************************/ 
// select our volume button
const volumeSvg = document.getElementById('volume_svg');
const volumeSvgDiv = document.getElementById('volume_svg_div');

let svgMouseDowned = false; 

const startSvgRotation = () => {
    svgMouseDowned = true;
}

volumeSvg.addEventListener("mousedown", startSvgRotation);

let cursor_direction = "";
let old_x = 0
let old_y = 0
let deg = 174;  // Default value for volume
const deltaDeg = 9; // Increment or decrement 4, 8, 12
let scaledVolume = 0;

const doSvgRotation = e => {

    if(svgMouseDowned == true) {

        let mouse_x = e.pageX;     // Get the horizontal mouse coordinate
        let mouse_y = e.pageY;     // Get the vertical mouse coordinate

        if (mouse_y < old_y ) {    // Compare with previous mouse Y to figure out direction
            cursor_direction="pos!";      // For debugging
            if( deg < (360.0 - deltaDeg) ) {
                deg+=deltaDeg;    // Increment volume with deltaDeg
                volumeSvg.style.transform = 'rotate('+deg+'deg)'; 

                if(audioContext) { // control the volume
                    scaledVolume = (deg * 10.0)/360.0;      // Convert degrees to 0-10 scale
                    gainNode.gain.value = scaledVolume;
                }
            }  
        }
        if (mouse_y > old_y) {
            cursor_direction="neg!"; // For debugging
            if(deg > deltaDeg) {
                deg-=deltaDeg;
                volumeSvg.style.transform = 'rotate('+deg+'deg)'; 
    
                if(audioContext) { 
                    scaledVolume = (deg * 10.0)/360.0;
                    gainNode.gain.value = scaledVolume;
                }
            } else if(audioContext) {
                scaledVolume = 0.0;
                gainNode.gain.value = scaledVolume;
            }
        }

        old_y = e.pageY;
    }
}

const stopSvgRotation = () => {
    if(svgMouseDowned == true) {
        svgMouseDowned = false;
    } 
}

document.addEventListener('mousemove', doSvgRotation);
document.addEventListener('mouseup', stopSvgRotation);


/* Main Canvas Function ****************************************************************/ 

const canvas = document.getElementById('canvas');
/* to implement for responsive screen size
canvas.width = window.screen.availWidth; //document.body.clientWidth; 
canvas.height = window.screen.availHeight; //document.body.clientHeight;
*/
canvas.width = 525;
canvas.height = 255;
canvasW = canvas.width;
canvasH = canvas.height;

const ctxCanvas = canvas.getContext('2d');
const colorsArray = ['#4A4940', '#33322C', '#3D3C35', '#8A8878', '#C9C6AF', '#545445', '#464A3D', '#545145',
                     '#4A463D', '#3A3D32', '#45394A', '#392F3D', '#2F2C3D', '#364761', '#2D404A', '#4A4926'];
const shuffledColors = shuffle(colorsArray); //shuffles colors every refresh

//Main draw function for bar graphs
function draw() {
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

