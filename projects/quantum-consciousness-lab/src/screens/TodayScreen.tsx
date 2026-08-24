import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DURATIONS, QUICK_GOALS } from '../data/content';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { COLORS } from '../theme';
import type { SessionPlan, UserLens } from '../types';
import { composeSession } from '../core/sessionComposer';

export function TodayScreen({ lens, onBegin }: { lens: UserLens; onBegin: (plan: SessionPlan) => void }) {
  const [goal, setGoal] = useState('Reset');
  const [minutes, setMinutes] = useState(10);
  const [intent, setIntent] = useState('');
  const [preview, setPreview] = useState<SessionPlan | null>(null);

  const lensLabel = useMemo(() => lens === 'science' ? 'Science' : lens === 'science-frontier' ? 'Science + Frontier' : 'Full Exploration', [lens]);

  function build() {
    const plan = composeSession({ intent, goal, minutes, lens }) as SessionPlan;
    setPreview(plan);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 22, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
      <Text style={{ color: COLORS.cyan, fontSize: 11, fontWeight: '800', letterSpacing: 2 }}>TODAY · {lensLabel.toUpperCase()}</Text>
      <Text style={{ color: COLORS.text, fontSize: 30, lineHeight: 36, fontWeight: '800', marginTop: 10 }}>What do you need right now?</Text>
      <Text style={{ color: COLORS.muted, fontSize: 14, lineHeight: 21, marginTop: 8 }}>One sentence is enough. The session composer chooses a controlled practice instead of sending you through a content maze.</Text>

      <TextInput
        value={intent}
        onChangeText={setIntent}
        placeholder="Example: I keep replaying an argument and need to let it go…"
        placeholderTextColor="#68708C"
        multiline
        style={{ minHeight: 100, color: COLORS.text, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, padding: 16, marginTop: 22, textAlignVertical: 'top', fontSize: 15, lineHeight: 21 }}
      />

      <Text style={{ color: COLORS.text, fontSize: 13, fontWeight: '700', marginTop: 20, marginBottom: 10 }}>Quick intention</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {QUICK_GOALS.map((item) => {
          const selected = goal === item;
          return <Pressable key={item} onPress={() => setGoal(item)} style={{ paddingHorizontal: 13, paddingVertical: 9, borderRadius: 999, borderWidth: 1, borderColor: selected ? COLORS.violet : COLORS.border, backgroundColor: selected ? '#2C2350' : COLORS.card }}><Text style={{ color: selected ? COLORS.text : COLORS.muted, fontWeight: '600' }}>{item}</Text></Pressable>;
        })}
      </View>

      <Text style={{ color: COLORS.text, fontSize: 13, fontWeight: '700', marginTop: 20, marginBottom: 10 }}>Time</Text>
      <View style={{ flexDirection: 'row', gap: 9 }}>
        {DURATIONS.map((value) => {
          const selected = minutes === value;
          return <Pressable key={value} onPress={() => setMinutes(value)} style={{ flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: selected ? COLORS.cyan : COLORS.border, backgroundColor: selected ? '#153345' : COLORS.card }}><Text style={{ color: selected ? COLORS.cyan : COLORS.muted, fontWeight: '800' }}>{value}m</Text></Pressable>;
        })}
      </View>

      <Pressable onPress={build} style={{ marginTop: 22 }}>
        <LinearGradient colors={[COLORS.violet, COLORS.indigo]} style={{ paddingVertical: 16, borderRadius: 18, alignItems: 'center' }}>
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>Create My Session</Text>
        </LinearGradient>
      </Pressable>

      {preview && (
        <View style={{ marginTop: 22, backgroundColor: COLORS.card, borderRadius: 22, borderWidth: 1, borderColor: COLORS.border, padding: 18 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.text, fontSize: 23, fontWeight: '800' }}>{preview.title}</Text>
              <Text style={{ color: COLORS.muted, marginTop: 4 }}>{preview.minutes} minutes · {preview.segments.length} phases</Text>
            </View>
            <EvidenceBadge level={preview.evidence} />
          </View>
          <Text style={{ color: COLORS.text, lineHeight: 21, marginTop: 14 }}>{preview.rationale}</Text>
          <Text style={{ color: COLORS.muted, lineHeight: 19, marginTop: 8, fontSize: 12 }}>{preview.lensNote}</Text>
          <View style={{ marginTop: 14, gap: 8 }}>
            {preview.segments.map((segment, index) => (
              <View key={segment.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#24294A', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}><Text style={{ color: COLORS.cyan, fontSize: 11, fontWeight: '800' }}>{index + 1}</Text></View>
                <Text style={{ color: COLORS.text, flex: 1 }}>{segment.title}</Text>
                <Text style={{ color: COLORS.muted }}>{segment.minutes}m</Text>
              </View>
            ))}
          </View>
          <Pressable onPress={() => onBegin(preview)} style={{ backgroundColor: '#F5F3FF', paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginTop: 18 }}><Text style={{ color: '#111327', fontWeight: '900' }}>Begin</Text></Pressable>
        </View>
      )}
    </ScrollView>
  );
}
