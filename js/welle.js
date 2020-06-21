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
/*
canvas.width = window.screen.availWidth; //document.body.clientWidth; 
canvas.height = window.screen.availHeight; //document.body.clientHeight;
*/
canvas.width = window.screen.availWidth; //document.body.clientWidth; 
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

