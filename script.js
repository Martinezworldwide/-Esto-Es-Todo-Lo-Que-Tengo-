// Animate fill bars or flashing warnings later
console.log("¡Esto Es Todo Lo Que Tengo! HUD loaded.");

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('track');
  const visualizer = document.createElement('div');
  visualizer.className = 'visualizer';
  document.body.appendChild(visualizer);

  // Create play button
  const playButton = document.createElement('button');
  playButton.className = 'play-button';
  playButton.innerHTML = '▶ PLAY';
  document.body.appendChild(playButton);

  // Create audio context and analyzer
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaElementSource(audio);
  
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // Create visualizer bars
  for (let i = 0; i < bufferLength; i++) {
    const bar = document.createElement('div');
    bar.className = 'visualizer-bar';
    visualizer.appendChild(bar);
  }

  const bars = document.querySelectorAll('.visualizer-bar');

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(dataArray);

    bars.forEach((bar, i) => {
      const height = (dataArray[i] / 255) * 100;
      bar.style.height = `${height}%`;
      bar.style.opacity = height / 100;
    });
  }

  // Play button click handler
  playButton.addEventListener('click', async () => {
    try {
      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Toggle play/pause
      if (audio.paused) {
        await audio.play();
        playButton.innerHTML = '⏸ PAUSE';
        animate();
      } else {
        audio.pause();
        playButton.innerHTML = '▶ PLAY';
      }
    } catch (error) {
      console.error('Audio error:', error);
      // If there's an error, just try to play again
      try {
        await audio.play();
        playButton.innerHTML = '⏸ PAUSE';
        animate();
      } catch (e) {
        console.error('Second attempt failed:', e);
        playButton.innerHTML = '▶ TRY AGAIN';
      }
    }
  });

  // Interactive elements
  const hudSections = document.querySelectorAll('.hud-section');
  let currentSection = 0;

  function updateBars() {
    hudSections.forEach((section, index) => {
      const fill = section.querySelector('.fill');
      const value = Math.sin(Date.now() / 1000 + index) * 0.5 + 0.5;
      fill.style.width = `${value * 100}%`;
    });
  }

  setInterval(updateBars, 50);

  // Add glitch effect on hover
  document.querySelectorAll('.hud-section').forEach(section => {
    section.addEventListener('mouseenter', () => {
      section.style.animation = 'glitch 0.3s infinite';
    });
    section.addEventListener('mouseleave', () => {
      section.style.animation = '';
    });
  });
});
