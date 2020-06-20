// for legacy browsers
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// get the audio element
const audioElement = document.querySelector('audio');

// pass it into the audio context
const track = audioContext.createMediaElementSource(audioElement);
var analyser = audioContext.createAnalyser();

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
const ctx = canvas.getContext('2d');

const initAnalyzer = () => {
  track.connect(analyser);
  
  analyser.fftSize = 2048;
}

initAnalyzer();

var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
analyser.getByteFrequencyData(dataArray);

//test stuff
var WIDTH = 300;
var HEIGHT = 300;
ctx.clearRect(0, 0, WIDTH, HEIGHT);

function draw() {
  var drawVisual = requestAnimationFrame(draw);
  analyser.getByteTimeDomainData(dataArray);
  ctx.fillStyle = 'rgb(200, 200, 200)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.beginPath();

  var sliceWidth = WIDTH * 1.0 / bufferLength;
  var x = 0;

  for(var i = 0; i < bufferLength; i++) {
   
    var v = dataArray[i] / 128.0;
    var y = v * HEIGHT/2;

    if(i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  }
  ctx.lineTo(canvas.width, canvas.height/2);
  ctx.stroke();
};

draw();
//finish test
console.log("batata");
