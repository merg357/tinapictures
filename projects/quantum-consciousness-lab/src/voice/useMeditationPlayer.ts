import { useCallback, useEffect, useRef, useState } from 'react';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import type { NarratorId } from '../types';
import { resolvePreviewAsset, resolveVoiceAsset } from './voiceManifest';

export type NarrationState = 'idle' | 'loading' | 'playing' | 'paused' | 'silence' | 'error';

type Options = {
  practiceId: string;
  narratorId: NarratorId;
  segmentIndex: number;
  started: boolean;
  running: boolean;
  reflecting: boolean;
  finished: boolean;
  minimalGuidance: boolean;
};

export function useMeditationPlayer(options: Options) {
  const player = useAudioPlayer(null, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);
  const [state, setState] = useState<NarrationState>('idle');
  const [error, setError] = useState<string | null>(null);
  const loadedKey = useRef('');
  const generation = useRef(0);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    }).catch((cause) => {
      setError(`Audio mode unavailable: ${String(cause)}`);
      setState('error');
    });
  }, []);

  useEffect(() => {
    if (status.didJustFinish && state === 'playing') setState('silence');
    if (status.error) {
      setError(status.error);
      setState('error');
    }
  }, [state, status.didJustFinish, status.error]);

  useEffect(() => {
    const { practiceId, narratorId, segmentIndex, started, running, reflecting, finished, minimalGuidance } = options;
    if (!started || reflecting || finished) {
      player.pause();
      if (reflecting || finished) {
        loadedKey.current = '';
        setState('idle');
      }
      return;
    }
    if (!running) {
      player.pause();
      setState((value) => value === 'playing' || value === 'loading' ? 'paused' : value);
      return;
    }
    if (minimalGuidance && (segmentIndex === 1 || segmentIndex === 3)) {
      player.pause();
      loadedKey.current = '';
      setState('silence');
      return;
    }

    const key = `${narratorId}:${practiceId}:${segmentIndex}`;
    if (loadedKey.current === key) {
      if (!status.playing && state !== 'silence') {
        player.play();
        setState('playing');
      }
      return;
    }

    let source: number;
    try {
      source = resolveVoiceAsset(practiceId, segmentIndex, narratorId);
    } catch (cause) {
      setError(String(cause));
      setState('error');
      return;
    }

    const token = ++generation.current;
    loadedKey.current = key;
    setError(null);
    setState('loading');
    try {
      player.replace(source);
      Promise.resolve(player.seekTo(0)).then(() => {
        if (generation.current !== token) return;
        player.play();
        setState('playing');
      }).catch((cause) => {
        if (generation.current !== token) return;
        setError(`Unable to start neural narration: ${String(cause)}`);
        setState('error');
      });
    } catch (cause) {
      setError(`Unable to load neural narration: ${String(cause)}`);
      setState('error');
    }
  }, [
    options.finished,
    options.minimalGuidance,
    options.narratorId,
    options.practiceId,
    options.reflecting,
    options.running,
    options.segmentIndex,
    options.started,
    player,
    state,
    status.playing,
  ]);

  const preview = useCallback(async (narratorId: NarratorId) => {
    generation.current += 1;
    loadedKey.current = '';
    setError(null);
    setState('loading');
    try {
      player.replace(resolvePreviewAsset(narratorId));
      await player.seekTo(0);
      player.play();
      setState('playing');
    } catch (cause) {
      setError(`Unable to preview neural narration: ${String(cause)}`);
      setState('error');
    }
  }, [player]);

  const stop = useCallback(() => {
    generation.current += 1;
    loadedKey.current = '';
    player.pause();
    player.seekTo(0).catch(() => undefined);
    setState('idle');
  }, [player]);

  return { state, error, preview, stop, status };
}
