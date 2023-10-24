let countdownInterval;
let audioContext = new (window.AudioContext || window.webkitAudioContext)();

function resumeAudioContext() {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

function beep(frequency = 520, duration = 200) {
  resumeAudioContext();

  let oscillator = audioContext.createOscillator();
  let gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = "square";
  gainNode.gain.setValueAtTime(1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
}

function playFinishSound() {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => beep(440, 1000), i * 1100);
  }
}

function startCountdown(duration) {
  clearInterval(countdownInterval);
  let timer = duration;
  updateTimerDisplay(timer);
  countdownInterval = setInterval(() => {
    timer -= 1;
    updateTimerDisplay(timer);

    let overlayHeight = (timer / duration) * 100;
    document.getElementById('overlay').style.height = overlayHeight + '%';
    document.getElementById('overlay').style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
   
 if (timer === Math.floor(duration / 2)) {
      beep();
    } else if (timer <= 10 && timer > 0) {
      beep();
      
    } else if (timer === 0) {
      clearInterval(countdownInterval);
      playFinishSound();
      document.getElementById('overlay').style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
    }

  }, 1000);
}

function updateTimerDisplay(timer) {
  let minutes = parseInt(timer / 60, 10);
  let seconds = parseInt(timer % 60, 10);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  document.getElementById('timer').textContent = minutes + ":" + seconds;
}

function setCustomTime() {
  let customTimeInput = document.getElementById('custom-time-input');
  let customTime = customTimeInput.value;
  if (customTime && customTime.match(/\d{2}:\d{2}:\d{2}/)) {
    let parts = customTime.split(':');
    let seconds = (+parts[0]) * 60 * 60 + (+parts[1]) * 60 + (+parts[2]);
    startCountdown(seconds);
  } else {
    alert("Please enter a valid time in HH:MM:SS format");
  }
}

function resetTimer() {
  clearInterval(countdownInterval);
  document.getElementById('timer').textContent = "00:00";
  document.getElementById('overlay').style.height = '0%';
}

document.getElementById('reset-button').addEventListener('click', resetTimer);
document.getElementById('custom-time-button').addEventListener('click', setCustomTime);

