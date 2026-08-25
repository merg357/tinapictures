import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { COLORS } from '../theme';
import type { ExperimentRecord, SessionRecord } from '../types';
import { createExperimentRecord } from '../core/appModel';
import { computeStats } from '../core/insights';
import { loadExperiments, saveExperiments } from '../lib/storage';

const PROTOCOLS = ['Coherence', 'Observer', 'Intention'];

function RatingRow({ value, onChange }: { value: number | null; onChange: (value: number) => void }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{Array.from({ length: 10 }, (_, i) => i + 1).map((number) => <Pressable key={number} onPress={() => onChange(number)} style={{ width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: value === number ? '#423585' : COLORS.cardSoft, borderWidth: 1, borderColor: value === number ? COLORS.violet : COLORS.border }}><Text style={{ color: value === number ? COLORS.text : COLORS.muted, fontSize: 12, fontWeight: '700' }}>{number}</Text></Pressable>)}</View>;
}

function titleCase(value: string | null) {
  if (!value) return 'Not enough data';
  return value.split('-').map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join(' ');
}

export function LabScreen({ sessions }: { sessions: SessionRecord[] }) {
  const [protocol, setProtocol] = useState('Coherence');
  const [before, setBefore] = useState<number | null>(null);
  const [after, setAfter] = useState<number | null>(null);
  const [records, setRecords] = useState<ExperimentRecord[]>([]);
  const [saved, setSaved] = useState(false);
  const stats = useMemo(() => computeStats(sessions), [sessions]);

  useEffect(() => { loadExperiments().then(setRecords); }, []);

  async function save() {
    if (before == null || after == null) return;
    const record = createExperimentRecord({ protocol, before, after }) as ExperimentRecord;
    const next = [record, ...records].slice(0, 50);
    setRecords(next);
    await saveExperiments(next);
    setSaved(true); setBefore(null); setAfter(null);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 22, paddingBottom: 120 }}>
      <Text style={{ color: COLORS.cyan, fontSize: 11, fontWeight: '900', letterSpacing: 2 }}>THE LAB</Text>
      <Text style={{ color: COLORS.text, fontSize: 30, fontWeight: '900', marginTop: 9 }}>What works for you?</Text>
      <Text style={{ color: COLORS.muted, lineHeight: 21, marginTop: 7 }}>Your results stay grounded in what you actually recorded. Small samples are treated as personal observations, not universal conclusions.</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 18 }}>
        <View style={{ width: '47%', flexGrow: 1, backgroundColor: COLORS.card, borderRadius: 17, borderWidth: 1, borderColor: COLORS.border, padding: 14 }}><Text style={{ color: COLORS.muted, fontSize: 10 }}>COMPLETED</Text><Text style={{ color: COLORS.text, fontSize: 25, fontWeight: '900', marginTop: 4 }}>{stats.sessions}</Text></View>
        <View style={{ width: '47%', flexGrow: 1, backgroundColor: COLORS.card, borderRadius: 17, borderWidth: 1, borderColor: COLORS.border, padding: 14 }}><Text style={{ color: COLORS.muted, fontSize: 10 }}>MINUTES</Text><Text style={{ color: COLORS.text, fontSize: 25, fontWeight: '900', marginTop: 4 }}>{stats.minutes}</Text></View>
        <View style={{ width: '47%', flexGrow: 1, backgroundColor: COLORS.card, borderRadius: 17, borderWidth: 1, borderColor: COLORS.border, padding: 14 }}><Text style={{ color: COLORS.muted, fontSize: 10 }}>AVG BEFORE → AFTER</Text><Text style={{ color: COLORS.green, fontSize: 20, fontWeight: '900', marginTop: 7 }}>{stats.sessions ? `${stats.averageBefore} → ${stats.averageAfter}` : '—'}</Text></View>
        <View style={{ width: '47%', flexGrow: 1, backgroundColor: COLORS.card, borderRadius: 17, borderWidth: 1, borderColor: COLORS.border, padding: 14 }}><Text style={{ color: COLORS.muted, fontSize: 10 }}>BEST PRACTICE</Text><Text numberOfLines={1} style={{ color: COLORS.cyan, fontSize: 16, fontWeight: '900', marginTop: 8 }}>{titleCase(stats.bestPractice)}</Text></View>
      </View>

      <View style={{ marginTop: 20, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, padding: 18 }}>
        <Text style={{ color: COLORS.text, fontSize: 17, fontWeight: '900' }}>Run a personal experiment</Text>
        <Text style={{ color: COLORS.muted, marginTop: 5, lineHeight: 19, fontSize: 13 }}>Rate the state you are tracking from 1–10 before and after a practice. Keep the misses as well as the hits.</Text>
        <Text style={{ color: COLORS.text, marginTop: 18, marginBottom: 9, fontWeight: '700' }}>Protocol</Text>
        <View style={{ flexDirection: 'row', gap: 7 }}>{PROTOCOLS.map((item) => <Pressable key={item} onPress={() => setProtocol(item)} style={{ flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: protocol === item ? COLORS.violet : COLORS.border, backgroundColor: protocol === item ? '#2B2250' : COLORS.cardSoft }}><Text style={{ color: protocol === item ? COLORS.text : COLORS.muted, fontSize: 12, fontWeight: '700' }}>{item}</Text></Pressable>)}</View>
        <Text style={{ color: COLORS.text, marginTop: 18, marginBottom: 9, fontWeight: '700' }}>Before</Text><RatingRow value={before} onChange={setBefore} />
        <Text style={{ color: COLORS.text, marginTop: 18, marginBottom: 9, fontWeight: '700' }}>After</Text><RatingRow value={after} onChange={setAfter} />
        <Pressable disabled={before == null || after == null} onPress={save} style={{ marginTop: 20, paddingVertical: 14, borderRadius: 15, alignItems: 'center', backgroundColor: before != null && after != null ? COLORS.violet : '#303447' }}><Text style={{ color: before != null && after != null ? '#FFFFFF' : '#777D92', fontWeight: '900' }}>{saved ? 'Saved' : 'Save observation'}</Text></Pressable>
        <Text style={{ color: '#747B95', fontSize: 11, lineHeight: 16, marginTop: 12 }}>A change in one session is a personal observation, not proof that the selected practice caused it.</Text>
      </View>

      {records.length > 0 && <View style={{ marginTop: 20 }}><Text style={{ color: COLORS.text, fontSize: 17, fontWeight: '900', marginBottom: 10 }}>Recent experiments</Text>{records.slice(0, 6).map((record) => <View key={record.id} style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: COLORS.card, borderRadius: 15, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 8 }}><View><Text style={{ color: COLORS.text, fontWeight: '700' }}>{record.protocol}</Text><Text style={{ color: COLORS.muted, fontSize: 12, marginTop: 3 }}>{new Date(record.createdAt).toLocaleDateString()}</Text></View><Text style={{ color: record.change < 0 ? COLORS.green : record.change > 0 ? COLORS.amber : COLORS.muted, fontSize: 18, fontWeight: '900' }}>{record.change > 0 ? '+' : ''}{record.change}</Text></View>)}</View>}
    </ScrollView>
  );
}
