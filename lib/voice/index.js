// JARVIS-style voice engine using Web Speech API — no API key required.

export function speak(text, opts = {}) {
  if (typeof window === 'undefined') return;
  const synth = window.speechSynthesis;
  if (!synth) return;

  synth.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.rate   = opts.rate   ?? 0.87;
  u.pitch  = opts.pitch  ?? 0.72;
  u.volume = opts.volume ?? 1;

  const apply = () => {
    const voices = synth.getVoices();
    const preferred = voices.find(v =>
      v.name === 'Daniel' ||
      v.name.includes('Google UK English Male') ||
      v.name.includes('Arthur') ||
      v.name.includes('Microsoft George - English (United Kingdom)')
    ) || voices.find(v => v.lang === 'en-GB')
      || voices.find(v => v.lang.startsWith('en'));
    if (preferred) u.voice = preferred;
    synth.speak(u);
  };

  if (synth.getVoices().length > 0) {
    apply();
  } else {
    synth.addEventListener('voiceschanged', apply, { once: true });
  }
}

export function cancel() {
  if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
}
