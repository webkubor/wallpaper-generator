// 简易 UI 音效管理器 (基于 Web Audio API)
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

type SoundType = 'click' | 'hover' | 'success' | 'warning' | 'switch';

interface SoundOptions {
  volume?: number;
  pitch?: number;
}

export const playSound = (type: SoundType, options: SoundOptions = {}) => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;
  const volume = options.volume ?? 0.1;

  switch (type) {
    case 'click':
      // 清脆的点击声
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, now);
      oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gainNode.gain.setValueAtTime(volume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      break;

    case 'switch':
      // 开关声
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(400, now);
      oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.1);
      gainNode.gain.setValueAtTime(volume * 0.8, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      oscillator.start(now);
      oscillator.stop(now + 0.15);
      break;
      
    case 'hover':
      // 极其微弱的滑过声
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(200, now);
      gainNode.gain.setValueAtTime(volume * 0.2, now);
      gainNode.gain.linearRampToValueAtTime(0.01, now + 0.05);
      oscillator.start(now);
      oscillator.stop(now + 0.05);
      break;

    case 'success':
      // 成功提示音 (大三和弦)
      playNote(523.25, now, 0.1, 'sine', volume); // C5
      playNote(659.25, now + 0.1, 0.2, 'sine', volume); // E5
      break;

    case 'warning':
      // 错误/警告
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, now);
      oscillator.frequency.linearRampToValueAtTime(100, now + 0.3);
      gainNode.gain.setValueAtTime(volume * 0.8, now);
      gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
      oscillator.start(now);
      oscillator.stop(now + 0.3);
      break;
  }
};

const playNote = (freq: number, time: number, duration: number, type: OscillatorType, vol: number) => {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
  osc.start(time);
  osc.stop(time + duration);
};

export const useSound = () => {
  return {
    play: playSound
  };
};
