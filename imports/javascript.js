const state = {
  analyser: null,
  audioSource: null,
  singingHeadInitialized: false,
  dataArray: null,
  audioSong: null,
  audioMouth: null,
  headMouthElement: null,
}

const actions = {
  togglePlay(element) {
    if (element.paused) {
      element.play();
    } else {
      element.pause();
    }
  },
  toggleMouth(isOpen = true) {
    if (state.headMouthElement === null) {
      state.headMouthElement = document.querySelector('#headMouth');
    }
    if (isOpen) {
      state.headMouthElement.classList.add('page-floating-head__mouth-image--shown');
    } else {
      state.headMouthElement.classList.remove('page-floating-head__mouth-image--shown');
    }
  },
  playMusic() {
    state.audioSong = document.querySelector('#audioSong');
    state.audioMouth = document.querySelector('#audioMouth');
    // 0.01 for ts
    state.audioMouth.volume = 0.02;
    actions.togglePlay(state.audioSong);
    actions.togglePlay(state.audioMouth);
    if (!state.audioMouth.paused) {
      actions.initializeSingingHead(state.audioMouth);
    }
  },
  animateSingingHead() {
    state.analyser.getByteFrequencyData(state.dataArray);
    const greaterThanZeroIfSound = state.dataArray[3];
    if (greaterThanZeroIfSound > 0 && !state.audioSong.paused) {
      actions.toggleMouth(true);
    } else {
      actions.toggleMouth(false);
    }
    requestAnimationFrame(actions.animateSingingHead);
  },
  initializeSingingHead(audioObject) {
    if (!state.singingHeadInitialized) {
      state.singingHeadInitialized = true;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioObject.crossOrigin = 'anonymous';
      state.audioSource = audioCtx.createMediaElementSource(audioObject);
      state.analyser = audioCtx.createAnalyser();
      // const volume = audioCtx.createGain();
      // volume.gain.value = 0.1;
      // state.analyser.connect(volume);
      state.audioSource.connect(state.analyser);
      state.analyser.connect(audioCtx.destination);
      state.analyser.fftSize = 32;
      const bufferLength = state.analyser.frequencyBinCount;
      state.dataArray = new Uint8Array(bufferLength);
      actions.animateSingingHead();
    }
  },
};

const init = {
  pageFloatingHead() {
    const head = document.querySelector('#head');
    const onMouseMove = (e) =>{
      head.style.left = e.pageX + 'px';
      head.style.top = e.pageY + 'px';
    }
    document.addEventListener('mousemove', onMouseMove);
  },
};

