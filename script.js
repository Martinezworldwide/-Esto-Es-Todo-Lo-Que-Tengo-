// Animate fill bars or flashing warnings later
console.log("¡Esto Es Todo Lo Que Tengo! HUD loaded.");

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('track');
  const playButton = document.getElementById('play-button');
  const playButtonFooter = document.getElementById('play-button-footer');
  const visualizer = document.getElementById('visualizer');
  const currentTime = document.getElementById('current-time');
  const metrics = document.querySelectorAll('.metric');
  const statusItems = document.querySelectorAll('.status-item');
  
  // Audio Control Hub Elements
  const volumeSlider = document.getElementById('volume-slider');
  const volumeValue = document.querySelector('.volume-value');
  const speedButtons = document.querySelectorAll('.speed-btn');
  const waveformContainer = document.querySelector('.waveform-container');
  const currentAudioTime = document.getElementById('current-audio-time');
  const totalAudioTime = document.getElementById('total-audio-time');
  
  // Initialize waveform preview bars
  const waveformBarCount = 40;
  for (let i = 0; i < waveformBarCount; i++) {
    const bar = document.createElement('div');
    bar.className = 'waveform-bar';
    bar.style.setProperty('--scale', (Math.random() * 0.7 + 0.3).toFixed(2));
    waveformContainer.appendChild(bar);
  }
  
  // Audio Control Setup
  function initAudioControls() {
    // Volume control
    volumeSlider.addEventListener('input', () => {
      const value = volumeSlider.value;
      audio.volume = value / 100;
      volumeValue.textContent = `${value}%`;
      
      // Update visual indicator
      volumeSlider.style.setProperty('--volume-level', `${value}%`);
      
      // Add glow effect on change
      volumeValue.style.textShadow = '0 0 15px var(--secondary-color)';
      setTimeout(() => {
        volumeValue.style.textShadow = '0 0 5px var(--secondary-color)';
      }, 300);
    });
    
    // Playback speed control
    speedButtons.forEach(button => {
      button.addEventListener('click', () => {
        const speed = parseFloat(button.getAttribute('data-speed'));
        audio.playbackRate = speed;
        
        // Update active button
        speedButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Add effect on change
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 200);
      });
    });
    
    // Audio time display
    audio.addEventListener('loadedmetadata', () => {
      const duration = formatTime(audio.duration);
      totalAudioTime.textContent = duration;
    });
    
    audio.addEventListener('timeupdate', () => {
      const current = formatTime(audio.currentTime);
      currentAudioTime.textContent = current;
      
      // Update waveform visualization
      updateWaveform();
    });
  }
  
  // Format time to MM:SS
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Update waveform visualization
  function updateWaveform() {
    const waveformBars = document.querySelectorAll('.waveform-bar');
    
    if (analyser && dataArray) {
      analyser.getByteFrequencyData(dataArray);
      
      waveformBars.forEach((bar, index) => {
        const value = dataArray[index % dataArray.length] / 255;
        bar.style.setProperty('--scale', value.toFixed(2));
      });
    } else {
      // Random animation when audio context not available
      waveformBars.forEach(bar => {
        const randomValue = Math.random() * 0.7 + 0.3;
        bar.style.setProperty('--scale', randomValue.toFixed(2));
      });
    }
  }
  
  // Run waveform animation even when paused
  setInterval(() => {
    if (audio.paused) {
      const waveformBars = document.querySelectorAll('.waveform-bar');
      waveformBars.forEach(bar => {
        const randomValue = Math.random() * 0.3 + 0.1;
        bar.style.setProperty('--scale', randomValue.toFixed(2));
      });
    }
  }, 100);

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
    
    // Also update the waveform in the audio control hub
    updateWaveform();
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
  function togglePlay() {
    try {
      if (audio.paused) {
        if (!audioContext) {
          setupAudioContext();
        }
        
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        
        audio.play();
        playButton.textContent = '⏸ PAUSE';
        playButtonFooter.textContent = '⏸ PAUSE AUDIO';
        playButton.style.boxShadow = '0 0 20px var(--primary-color)';
        playButtonFooter.style.boxShadow = '0 0 20px var(--primary-color)';
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
        playButton.textContent = '▶ PLAY';
        playButtonFooter.textContent = '▶ PLAY AUDIO';
        playButton.style.boxShadow = 'var(--neon-glow)';
        playButtonFooter.style.boxShadow = 'var(--neon-glow)';
        cancelAnimationFrame(animationId);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      playButton.textContent = '⚠ TRY AGAIN';
      playButton.style.boxShadow = '0 0 20px #ff0000';
    }
  }
  
  // Event listeners for play buttons (both buttons control the same audio)
  playButton.addEventListener('click', togglePlay);
  playButtonFooter.addEventListener('click', togglePlay);

  // Initialize audio controls
  initAudioControls();

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
