const state = {
  singingHeadInterval: null,
}

const actions = {
  togglePlay(element) {
    if (element.paused) {
      element.play();
    } else {
      element.pause();
    }
  },
  playMusic() {
    console.log('PLAY!');
    const audioSong = document.querySelector('#audioSong');
    const audioMouth = document.querySelector('#audioMouth');
    actions.togglePlay(audioSong);
    actions.togglePlay(audioMouth);
    if (!audioMouth.paused) {
      actions.initializeSingingHead(audioMouth);
    }
  },
  initializeSingingHead(audioObject) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let audioSource = null;
    let analyser = null;
    audioObject.crossOrigin = 'anonymous';
    audioSource = audioCtx.createMediaElementSource(audioObject);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    
    analyser.fftSize = 32;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    clearInterval(state.singingHeadInterval);
    state.singingHeadInterval = setInterval(() => {
      console.log(dataArray[0]);
    }, 1000);
  },
};

const init = {
  pageFloatingHead() {
    console.log('Page floating head');
  },
};

