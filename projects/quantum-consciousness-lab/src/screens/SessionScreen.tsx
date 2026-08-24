import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { BreathOrb } from '../components/BreathOrb';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { COLORS } from '../theme';
import type { SessionPlan } from '../types';

export function SessionScreen({ plan, onExit }: { plan: SessionPlan; onExit: () => void }) {
  const totalSeconds = plan.minutes * 60;
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [spokenSegment, setSpokenSegment] = useState(-1);

  const currentIndex = useMemo(() => {
    let cursor = 0;
    for (let i = 0; i < plan.segments.length; i += 1) {
      cursor += plan.segments[i].minutes * 60;
      if (elapsed < cursor) return i;
    }
    return plan.segments.length - 1;
  }, [elapsed, plan.segments]);
  const current = plan.segments[currentIndex];
  const finished = elapsed >= totalSeconds;

  useEffect(() => {
    if (!running || finished) return;
    const timer = setInterval(() => setElapsed((value) => Math.min(value + 1, totalSeconds)), 1000);
    return () => clearInterval(timer);
  }, [finished, running, totalSeconds]);

  useEffect(() => {
    if (finished) {
      setRunning(false);
      Speech.stop();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      return;
    }
    if (currentIndex !== spokenSegment) {
      setSpokenSegment(currentIndex);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
      Speech.stop();
      Speech.speak(current.prompt, { rate: 0.83, pitch: 0.96 });
    }
  }, [current, currentIndex, finished, spokenSegment]);

  useEffect(() => () => { Speech.stop(); }, []);

  const remaining = Math.max(0, totalSeconds - elapsed);
  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = (remaining % 60).toString().padStart(2, '0');
  const breathActive = /(breath|settle|regulate|arrive)/i.test(current.title);

  function toggle() {
    if (running) Speech.stop();
    else Speech.speak(current.prompt, { rate: 0.83, pitch: 0.96 });
    setRunning((value) => !value);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView contentContainerStyle={{ padding: 22, paddingTop: 28, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pressable onPress={onExit}><Text style={{ color: COLORS.muted, fontWeight: '700' }}>Close</Text></Pressable>
          <EvidenceBadge level={plan.evidence} />
        </View>
        <Text style={{ color: COLORS.cyan, fontSize: 11, letterSpacing: 2, fontWeight: '800', marginTop: 28 }}>CURRENT PRACTICE</Text>
        <Text style={{ color: COLORS.text, fontSize: 32, fontWeight: '800', marginTop: 8 }}>{plan.title}</Text>
        <Text style={{ color: COLORS.muted, marginTop: 6 }}>{current.title}</Text>

        {breathActive ? <BreathOrb active={!finished} /> : <View style={{ height: 210, alignItems: 'center', justifyContent: 'center' }}><View style={{ width: 140, height: 140, borderRadius: 70, borderWidth: 1, borderColor: '#4F46E5AA', backgroundColor: '#312E8122', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: COLORS.cyan, fontSize: 12, letterSpacing: 1.4 }}>OBSERVE</Text></View></View>}

        <Text style={{ color: COLORS.text, fontSize: 42, fontVariant: ['tabular-nums'], textAlign: 'center', fontWeight: '700' }}>{mm}:{ss}</Text>
        <Text style={{ color: COLORS.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 14 }}>{finished ? 'Session complete. Notice what changed before you move on.' : current.prompt}</Text>

        <View style={{ height: 5, borderRadius: 999, backgroundColor: '#22273A', overflow: 'hidden', marginTop: 24 }}><View style={{ width: `${Math.min(100, (elapsed / totalSeconds) * 100)}%`, height: '100%', backgroundColor: COLORS.violet }} /></View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 24 }}>
          {!finished && <Pressable onPress={toggle} style={{ flex: 1, backgroundColor: '#F5F3FF', paddingVertical: 15, alignItems: 'center', borderRadius: 16 }}><Text style={{ color: '#111327', fontWeight: '900' }}>{running ? 'Pause' : 'Resume'}</Text></Pressable>}
          <Pressable onPress={onExit} style={{ flex: 1, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 15, alignItems: 'center', borderRadius: 16 }}><Text style={{ color: COLORS.text, fontWeight: '800' }}>{finished ? 'Finish' : 'Stop'}</Text></Pressable>
        </View>
        <Text style={{ color: '#727994', fontSize: 11, textAlign: 'center', lineHeight: 17, marginTop: 18 }}>Wellness and self-exploration only. Unusual imagery or sensations are subjective experiences, not proof of a supernatural mechanism.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
