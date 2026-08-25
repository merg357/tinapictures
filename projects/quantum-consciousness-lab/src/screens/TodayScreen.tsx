import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { COLORS } from '../theme';
import type { SessionPlan, SessionRecord, UserLens } from '../types';
import { composeSession } from '../core/sessionComposer';
import { computeStats, recommendPractice } from '../core/insights';

const STATES = [
  { label: 'Calm', glyph: '◌', phrase: 'I feel stressed and want to calm down' },
  { label: 'Sleep', glyph: '☾', phrase: 'I cannot sleep and need deep rest' },
  { label: 'Focus', glyph: '◎', phrase: 'My mind is scattered and I want focus' },
  { label: 'Reset', glyph: '↺', phrase: 'I need to reset and stop overthinking' },
  { label: 'Intention', glyph: '◇', phrase: 'I want to visualize a goal and set an intention' },
  { label: 'Go Deep', glyph: '∞', phrase: 'I want to go deep into expanded consciousness' },
];
const DURATIONS = [5, 10, 15, 20];

function practiceName(id: string | null) {
  if (!id) return '—';
  return id.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function TodayScreen({ lens, records, onBegin }: { lens: UserLens; records: SessionRecord[]; onBegin: (plan: SessionPlan) => void }) {
  const [selected, setSelected] = useState('Reset');
  const [minutes, setMinutes] = useState(10);
  const [intent, setIntent] = useState('');
  const [preview, setPreview] = useState<SessionPlan | null>(null);
  const stats = useMemo(() => computeStats(records), [records]);
  const lensLabel = lens === 'science' ? 'Science' : lens === 'science-frontier' ? 'Science + Frontier' : 'Full Exploration';

  function chooseState(label: string, phrase: string) {
    setSelected(label);
    setIntent(phrase);
    setPreview(null);
  }

  function build() {
    const state = STATES.find((item) => item.label === selected);
    const request = intent.trim() || state?.phrase || 'I need a reset';
    const recommendation = recommendPractice(request);
    const plan = composeSession({ intent: `${request} ${recommendation.pathId}`, goal: selected, minutes, lens }) as SessionPlan;
    setPreview(plan);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 22, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
      <Text style={{ color: COLORS.cyan, fontSize: 11, fontWeight: '900', letterSpacing: 2 }}>CONSCIOUSNESS LAB · {lensLabel.toUpperCase()}</Text>
      <Text style={{ color: COLORS.text, fontSize: 31, lineHeight: 37, fontWeight: '900', marginTop: 10 }}>How do you want to feel?</Text>
      <Text style={{ color: COLORS.muted, fontSize: 14, lineHeight: 21, marginTop: 7 }}>Choose a state or tell the app what is going on. You get one recommendation, not a content maze.</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 20 }}>
        {STATES.map((item) => {
          const active = selected === item.label;
          return <Pressable accessibilityRole="button" key={item.label} onPress={() => chooseState(item.label, item.phrase)} style={{ width: '31%', minWidth: 96, flexGrow: 1, minHeight: 82, justifyContent: 'center', alignItems: 'center', borderRadius: 18, borderWidth: 1, borderColor: active ? COLORS.cyan : COLORS.border, backgroundColor: active ? '#152D3A' : COLORS.card }}><Text style={{ color: active ? COLORS.cyan : '#8A93B2', fontSize: 22 }}>{item.glyph}</Text><Text style={{ color: active ? COLORS.text : COLORS.muted, fontWeight: '800', marginTop: 6 }}>{item.label}</Text></Pressable>;
        })}
      </View>

      <TextInput value={intent} onChangeText={(value) => { setIntent(value); setPreview(null); }} placeholder="Or tell me what is going on…" placeholderTextColor="#69718C" multiline style={{ minHeight: 86, color: COLORS.text, backgroundColor: '#111526', borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, padding: 15, marginTop: 16, textAlignVertical: 'top', fontSize: 15, lineHeight: 21 }} />

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
        {DURATIONS.map((value) => <Pressable key={value} onPress={() => setMinutes(value)} style={{ flex: 1, paddingVertical: 10, borderRadius: 13, alignItems: 'center', borderWidth: 1, borderColor: minutes === value ? COLORS.violet : COLORS.border, backgroundColor: minutes === value ? '#2B2446' : COLORS.card }}><Text style={{ color: minutes === value ? COLORS.text : COLORS.muted, fontWeight: '900' }}>{value}m</Text></Pressable>)}
      </View>

      <Pressable onPress={build} accessibilityRole="button" accessibilityLabel="Recommend my practice" style={{ marginTop: 15 }}>
        <LinearGradient colors={[COLORS.violet, COLORS.indigo]} style={{ paddingVertical: 15, borderRadius: 17, alignItems: 'center' }}><Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '900' }}>Recommend My Practice</Text></LinearGradient>
      </Pressable>

      {preview && <View style={{ marginTop: 16, backgroundColor: '#F4F2FF', borderRadius: 22, padding: 18 }}>
        <Text style={{ color: '#5B5FC7', fontSize: 10, letterSpacing: 1.5, fontWeight: '900' }}>RECOMMENDED FOR YOU</Text>
        <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'flex-start', gap: 10 }}><View style={{ flex: 1 }}><Text style={{ color: '#101326', fontSize: 24, fontWeight: '900' }}>{preview.title}</Text><Text style={{ color: '#5D637A', marginTop: 4 }}>{preview.minutes} min · {preview.segments.length} phases</Text></View><EvidenceBadge level={preview.evidence} /></View>
        <Text style={{ color: '#343A52', fontSize: 13.5, lineHeight: 20, marginTop: 12 }}>{preview.rationale}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`Begin ${preview.title}`} onPress={() => onBegin(preview)} style={{ backgroundColor: '#11152A', paddingVertical: 14, borderRadius: 15, alignItems: 'center', marginTop: 16 }}><Text style={{ color: '#FFFFFF', fontWeight: '900' }}>Begin {preview.title}</Text></Pressable>
      </View>}

      <Text style={{ color: COLORS.text, fontSize: 17, fontWeight: '900', marginTop: 24 }}>Your pattern</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 10 }}>
        <View style={{ width: '47%', flexGrow: 1, backgroundColor: COLORS.card, borderRadius: 17, padding: 14, borderWidth: 1, borderColor: COLORS.border }}><Text style={{ color: COLORS.muted, fontSize: 11 }}>SESSIONS</Text><Text style={{ color: COLORS.text, fontSize: 25, fontWeight: '900', marginTop: 4 }}>{stats.sessions}</Text></View>
        <View style={{ width: '47%', flexGrow: 1, backgroundColor: COLORS.card, borderRadius: 17, padding: 14, borderWidth: 1, borderColor: COLORS.border }}><Text style={{ color: COLORS.muted, fontSize: 11 }}>MINUTES</Text><Text style={{ color: COLORS.text, fontSize: 25, fontWeight: '900', marginTop: 4 }}>{stats.minutes}</Text></View>
        <View style={{ width: '47%', flexGrow: 1, backgroundColor: COLORS.card, borderRadius: 17, padding: 14, borderWidth: 1, borderColor: COLORS.border }}><Text style={{ color: COLORS.muted, fontSize: 11 }}>AVG STATE CHANGE</Text><Text style={{ color: stats.averageChange < 0 ? COLORS.green : COLORS.text, fontSize: 23, fontWeight: '900', marginTop: 4 }}>{stats.sessions ? stats.averageChange : '—'}</Text></View>
        <View style={{ width: '47%', flexGrow: 1, backgroundColor: COLORS.card, borderRadius: 17, padding: 14, borderWidth: 1, borderColor: COLORS.border }}><Text style={{ color: COLORS.muted, fontSize: 11 }}>BEST SO FAR</Text><Text numberOfLines={1} style={{ color: COLORS.cyan, fontSize: 17, fontWeight: '900', marginTop: 7 }}>{practiceName(stats.bestPractice)}</Text></View>
      </View>
    </ScrollView>
  );
}
