// for legacy browsers
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// get the audio element
const audioElement = document.querySelector('audio');

// pass it into the audio context
const track = audioContext.createMediaElementSource(audioElement);
var analyser = audioContext.createAnalyser();
track.connect(analyser);
analyser.fftSize = 2048;

//init dataArray for analysing
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

track.connect(audioContext.destination);

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


const canvas = document.getElementById('canvas');
canvas.width = window.screen.availWidth; //document.body.clientWidth; 
canvas.height = window.screen.availHeight; //document.body.clientHeight;
canvasW = canvas.width;
canvasH = canvas.height;

const ctxCanvas = canvas.getContext('2d');
ctxCanvas.FillStyle = '#3D3C35';

//Main draw function for bar graphs
function draw(){
    var posX = 300; //WARNING: after fixing CSS, change this to 0
    var posY = 300;

    // var drawVisual = requestAnimationFrame(draw);
    
    analyser.getByteTimeDomainData(dataArray);

    ctxCanvas.clearRect(0, 0, canvas.width, canvas.height);

    //10 rectangle loop
    for(let i = 0; i < 10; i++) {
        ctxCanvas.fillRect(i * 55 + posX, 100 + posY, 50, -100 - Math.random()*100);
    }
}
setInterval(draw, 100); //calls draw every X ms






// if (canvas.getContext) {
  //ctxCanvas.fillStyle = 'rgb(200,200,200)';
  //fillRect(x pos, y pos, rectangle width, rectangle height)
  //ctxCanvas.fillRect(0, 0, canvas.width, canvas.height);
// }
/*
function init()
{
    canvas = document.getElementById("mainCanvas");
    canvas.width = document.body.clientWidth; //document.width is obsolete
    canvas.height = document.body.clientHeight; //document.height is obsolete
    canvasW = canvas.width;
    canvasH = canvas.height;

    if( canvas.getContext )
    {
        setup();
        setInterval( run , 33 );
    }
}
*/


