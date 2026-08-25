import { useCallback, useEffect, useRef, useState } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import type { AffirmationDefinition, AffirmationStyle, NarratorId } from '../types';
import { cadenceIntervalSeconds } from '../data/affirmations';
import { resolveAffirmationAsset } from './affirmationManifest';

export type AffirmationPlaybackState = 'idle' | 'playing' | 'waiting' | 'paused' | 'error';

export function useAffirmationPlayer({ items, narrator, style, cadence, narrationVolume }: {
  items: AffirmationDefinition[];
  narrator: NarratorId;
  style: AffirmationStyle;
  cadence: 'occasional' | 'regular' | 'affirmation-only';
  narrationVolume: number;
}) {
  const player = useAudioPlayer(null, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);
  const [state, setState] = useState<AffirmationPlaybackState>('idle');
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const running = useRef(false);

  useEffect(() => { player.volume = Math.max(0, Math.min(1, narrationVolume)); }, [narrationVolume, player]);

  const playIndex = useCallback((nextIndex: number) => {
    if (!items.length) return;
    const normalized = nextIndex % items.length;
    const item = items[normalized];
    try {
      player.replace(resolveAffirmationAsset(item.id, style, narrator));
      player.seekTo(0).then(() => {
        if (!running.current) return;
        setIndex(normalized);
        player.play();
        setState('playing');
      }).catch((cause) => {
        setError(`Unable to start affirmation: ${String(cause)}`);
        setState('error');
      });
    } catch (cause) {
      setError(`Unable to load affirmation: ${String(cause)}`);
      setState('error');
    }
  }, [items, narrator, player, style]);

  useEffect(() => {
    if (!status.didJustFinish || !running.current || state !== 'playing') return;
    setState('waiting');
    const waitMs = cadenceIntervalSeconds(cadence) * 1000;
    timer.current = setTimeout(() => playIndex(index + 1), waitMs);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [cadence, index, playIndex, state, status.didJustFinish]);

  const start = useCallback(() => {
    if (!items.length) return;
    if (timer.current) clearTimeout(timer.current);
    running.current = true;
    setError(null);
    playIndex(index);
  }, [index, items.length, playIndex]);

  const pause = useCallback(() => {
    running.current = false;
    if (timer.current) clearTimeout(timer.current);
    player.pause();
    setState('paused');
  }, [player]);

  const resume = useCallback(() => {
    running.current = true;
    if (state === 'paused' && status.currentTime > 0 && !status.didJustFinish) {
      player.play();
      setState('playing');
    } else playIndex(index);
  }, [index, playIndex, player, state, status.currentTime, status.didJustFinish]);

  const stop = useCallback(() => {
    running.current = false;
    if (timer.current) clearTimeout(timer.current);
    player.pause();
    player.seekTo(0).catch(() => undefined);
    setState('idle');
  }, [player]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return { state, error, index, current: items[index] ?? null, start, pause, resume, stop, isNarrating: state === 'playing' && status.playing };
}
