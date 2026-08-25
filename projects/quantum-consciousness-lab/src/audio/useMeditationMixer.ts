import { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import type { AudioSettings } from '../types';
import { BREATH_PULSE_ASSET } from './soundManifest';
import { resolvePlayableSoundSource } from './packManager';

const { effectiveBackgroundVolume } = require('../core/audioModel') as {
  effectiveBackgroundVolume: (volume: number, narrationActive: boolean) => number;
};

type MixerOptions = {
  settings: AudioSettings;
  narrationActive: boolean;
  started: boolean;
  running: boolean;
  reflecting: boolean;
  finished: boolean;
};

export type MixerState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export function useMeditationMixer(options: MixerOptions) {
  const background = useAudioPlayer(null, { updateInterval: 500 });
  const frequency = useAudioPlayer(null, { updateInterval: 500 });
  const breath = useAudioPlayer(null, { updateInterval: 500 });
  const [state, setState] = useState<MixerState>('idle');
  const [error, setError] = useState<string | null>(null);
  const loadedBackground = useRef('');
  const loadedFrequency = useRef('');
  const breathLoaded = useRef(false);

  const active = options.started && options.running && !options.reflecting && !options.finished;

  useEffect(() => {
    background.loop = true;
    frequency.loop = true;
    breath.loop = true;
  }, [background, breath, frequency]);

  useEffect(() => {
    background.volume = effectiveBackgroundVolume(options.settings.backgroundVolume, options.narrationActive);
    frequency.volume = options.settings.frequencyVolume;
    breath.volume = 0.22;
  }, [background, breath, frequency, options.narrationActive, options.settings.backgroundVolume, options.settings.frequencyVolume]);

  useEffect(() => {
    let cancelled = false;
    async function syncBackground() {
      const id = options.settings.backgroundTrackId;
      if (id === 'off') {
        background.pause();
        loadedBackground.current = '';
        return;
      }
      if (loadedBackground.current !== id) {
        setState('loading');
        const source = await resolvePlayableSoundSource(id);
        if (cancelled) return;
        if (!source) {
          background.pause();
          loadedBackground.current = '';
          setError(`Sound pack not downloaded: ${id}`);
          return;
        }
        background.replace(source);
        loadedBackground.current = id;
      }
      if (active) background.play(); else background.pause();
    }
    syncBackground().catch((cause) => {
      if (!cancelled) {
        setError(`Background audio unavailable: ${String(cause)}`);
        setState('error');
      }
    });
    return () => { cancelled = true; };
  }, [active, background, options.settings.backgroundTrackId]);

  useEffect(() => {
    let cancelled = false;
    async function syncFrequency() {
      const id = options.settings.frequencyTrackId;
      if (id === 'off') {
        frequency.pause();
        loadedFrequency.current = '';
        return;
      }
      if (loadedFrequency.current !== id) {
        setState('loading');
        const source = await resolvePlayableSoundSource(id);
        if (cancelled) return;
        if (!source) {
          frequency.pause();
          loadedFrequency.current = '';
          setError(`Frequency pack not downloaded: ${id}`);
          return;
        }
        frequency.replace(source);
        loadedFrequency.current = id;
      }
      if (active) frequency.play(); else frequency.pause();
    }
    syncFrequency().catch((cause) => {
      if (!cancelled) {
        setError(`Frequency audio unavailable: ${String(cause)}`);
        setState('error');
      }
    });
    return () => { cancelled = true; };
  }, [active, frequency, options.settings.frequencyTrackId]);

  useEffect(() => {
    if (options.settings.breathPulseEnabled) {
      if (!breathLoaded.current) {
        breath.replace(BREATH_PULSE_ASSET);
        breathLoaded.current = true;
      }
      if (active) breath.play(); else breath.pause();
    } else {
      breath.pause();
    }
  }, [active, breath, options.settings.breathPulseEnabled]);

  useEffect(() => {
    if (error) return;
    if (!options.started || options.reflecting || options.finished) setState('idle');
    else if (!options.running) setState('paused');
    else setState('playing');
  }, [error, options.finished, options.reflecting, options.running, options.started]);

  function stop() {
    background.pause();
    frequency.pause();
    breath.pause();
    setState('idle');
  }

  return {
    state,
    error,
    stop,
    backgroundActive: active && options.settings.backgroundTrackId !== 'off' && !!loadedBackground.current,
    frequencyActive: active && options.settings.frequencyTrackId !== 'off' && !!loadedFrequency.current,
    breathActive: active && options.settings.breathPulseEnabled,
  };
}
