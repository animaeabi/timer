let countdownInterval;
let beepSound, finishSound;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize audio objects
  beepSound = new Audio('https://freesound.org/data/previews/80/80921_1022651-lq.mp3'); // Beep sound
  finishSound = new Audio('http://soundbible.com/mp3/analog-watch-alarm_daniel-simion.mp3'); // Finish sound

  // Set the volume if necessary
  beepSound.volume = 0.5;
  finishSound.volume = 0.5;

  // Attempt to "unlock" audio playback
  document.getElementById('app').addEventListener('click', () => {
    beepSound.play().then(() => beepSound.pause());
    finishSound.play().then(() => finishSound.pause());
  });

  // Event listeners for buttons
  document.getElementById('reset-button').addEventListener('click', resetTimer);
  document.getElementById('custom-time-button').addEventListener('click', setCustomTime);
});

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
      beepSound.currentTime = 0;
      beepSound.play();
    } else if (timer <= 10 && timer > 0) {
      beepSound.currentTime = 0;
      beepSound.play();
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

function playFinishSound() {
  finishSound.currentTime = 0;
  finishSound.play();
  setTimeout(() => {
    finishSound.currentTime = 0;
    finishSound.play();
  }, 1100);
  setTimeout(() => {
    finishSound.currentTime = 0;
    finishSound.play();
  }, 2200);
}

function resetTimer() {
  clearInterval(countdownInterval);
  document.getElementById('timer').textContent = "00:00";
  document.getElementById('overlay').style.height = '0%';
}
