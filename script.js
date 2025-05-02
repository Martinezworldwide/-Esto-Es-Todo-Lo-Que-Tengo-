// Animate fill bars or flashing warnings later
console.log("¡Esto Es Todo Lo Que Tengo! HUD loaded.");

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('track');
  const playButton = document.getElementById('play-button');
  const visualizer = document.getElementById('visualizer');
  const currentTime = document.getElementById('current-time');
  const metrics = document.querySelectorAll('.metric');
  const statusItems = document.querySelectorAll('.status-item');

  // Update timestamp with glitch effect
  function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    currentTime.textContent = timeStr;
    
    // Random glitch effect
    if (Math.random() < 0.1) {
      currentTime.style.textShadow = '0 0 10px var(--primary-color)';
      setTimeout(() => {
        currentTime.style.textShadow = '0 0 5px var(--secondary-color)';
      }, 100);
    }
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

  // Visualizer animation with enhanced effects
  function animate() {
    animationId = requestAnimationFrame(animate);
    
    if (!analyser) return;
    
    analyser.getByteFrequencyData(dataArray);
    const bars = document.querySelectorAll('.visualizer-bar');
    
    bars.forEach((bar, index) => {
      const value = dataArray[index % dataArray.length] / 255;
      const height = value * 100;
      bar.style.height = `${height}%`;
      
      // Add color variation based on frequency
      const hue = (index / bars.length) * 360;
      bar.style.background = `linear-gradient(to top, 
        hsl(${hue}, 100%, 50%), 
        hsl(${(hue + 60) % 360}, 100%, 50%)
      )`;
    });
  }

  // Animate metrics with metal energy effect
  function updateMetrics() {
    metrics.forEach(metric => {
      const progress = metric.querySelector('.progress');
      const value = metric.querySelector('.value');
      const currentWidth = parseInt(progress.style.width);
      const newWidth = Math.min(100, Math.max(0, currentWidth + (Math.random() * 2 - 1)));
      
      progress.style.width = `${newWidth}%`;
      value.textContent = `${Math.round(newWidth)}%`;
      
      // Add glow effect on significant changes
      if (Math.abs(newWidth - currentWidth) > 5) {
        value.style.textShadow = '0 0 10px var(--secondary-color)';
        setTimeout(() => {
          value.style.textShadow = '0 0 5px var(--secondary-color)';
        }, 200);
      }
    });
  }
  setInterval(updateMetrics, 1000);

  // Play button handler with enhanced effects
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
        playButton.textContent = '⏸ PAUSE AUDIO';
        playButton.style.boxShadow = '0 0 20px var(--primary-color)';
        animate();
        
        // Update status indicators
        statusItems.forEach(item => {
          const status = item.querySelector('.status');
          status.style.animation = 'glitch 0.3s infinite';
          setTimeout(() => {
            status.style.animation = '';
          }, 1000);
        });
      } else {
        audio.pause();
        playButton.textContent = '▶ PLAY AUDIO';
        playButton.style.boxShadow = 'var(--neon-glow)';
        cancelAnimationFrame(animationId);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      playButton.textContent = '⚠ TRY AGAIN';
      playButton.style.boxShadow = '0 0 20px #ff0000';
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
