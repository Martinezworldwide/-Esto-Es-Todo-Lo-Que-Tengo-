// Animate fill bars or flashing warnings later
console.log("¡Esto Es Todo Lo Que Tengo! HUD loaded.");

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('track');
  const playButton = document.getElementById('play-button');
  const visualizer = document.getElementById('visualizer');
  const currentTime = document.getElementById('current-time');

  // Update timestamp
  function updateTime() {
    const now = new Date();
    currentTime.textContent = now.toLocaleTimeString();
  }
  updateTime();
  setInterval(updateTime, 1000);

  // Create visualizer bars
  const barCount = 50;
  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement('div');
    bar.className = 'visualizer-bar';
    visualizer.appendChild(bar);
  }

  // Audio context setup
  let audioContext;
  let analyser;
  let dataArray;
  let animationId;

  function setupAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  }

  // Visualizer animation
  function animate() {
    animationId = requestAnimationFrame(animate);
    
    if (!analyser) return;
    
    analyser.getByteFrequencyData(dataArray);
    const bars = document.querySelectorAll('.visualizer-bar');
    
    bars.forEach((bar, index) => {
      const value = dataArray[index % dataArray.length] / 255;
      const height = value * 100;
      bar.style.height = `${height}%`;
    });
  }

  // Play button handler
  playButton.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        if (!audioContext) {
          setupAudioContext();
        }
        
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
        await audio.play();
        playButton.textContent = 'Pause Audio';
        animate();
      } else {
        audio.pause();
        playButton.textContent = 'Play Audio';
        cancelAnimationFrame(animationId);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      playButton.textContent = 'Error - Click to Retry';
    }
  });

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    if (audioContext) {
      audioContext.close();
    }
    cancelAnimationFrame(animationId);
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
