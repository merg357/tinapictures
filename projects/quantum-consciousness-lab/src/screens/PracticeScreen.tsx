import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { COLORS } from '../theme';
import type { EvidenceLevel, SessionPlan, UserLens } from '../types';
import { composeSession } from '../core/sessionComposer';

const PRACTICES: Array<{ id: string; title: string; subtitle: string; evidence: EvidenceLevel; goal: string; intent: string }> = [
  { id: 'coherence', title: 'Coherence', subtitle: 'Slow breathing + nervous-system settling', evidence: 'Supported', goal: 'Calm', intent: 'I feel stressed and want coherence breathing' },
  { id: 'deep-rest', title: 'Deep Rest', subtitle: 'Low-guidance body release for sleep', evidence: 'Supported', goal: 'Sleep', intent: 'I want deep rest and sleep' },
  { id: 'observer', title: 'Observer', subtitle: 'Step out of repetitive thoughts', evidence: 'Established', goal: 'Reset', intent: 'I am overthinking and want observer practice' },
  { id: 'intention', title: 'Intention', subtitle: 'Visualization + concrete next action', evidence: 'Supported', goal: 'Intention', intent: 'I want to visualize a goal and set an intention' },
  { id: 'quantum-foundations', title: 'Quantum Foundations', subtitle: 'Meditation paired with accurate quantum concepts', evidence: 'Established', goal: 'Quantum', intent: 'I want to explore quantum physics and observation' },
  { id: 'expanded-consciousness', title: 'Expanded Consciousness', subtitle: 'Hypnagogia, open awareness + deep quiet', evidence: 'Emerging', goal: 'Go Deep', intent: 'I want to go deep into expanded consciousness' },
  { id: 'synchronicity-dreams', title: 'Synchronicity & Dreams', subtitle: 'Symbols, meaning + multiple explanatory lenses', evidence: 'Philosophical', goal: 'Dreams', intent: 'I want to explore a dream or synchronicity' },
];

const DURATIONS = [5, 10, 15, 20];

export function PracticeScreen({ lens, onBegin }: { lens: UserLens; onBegin: (plan: SessionPlan) => void }) {
  const [minutes, setMinutes] = useState(10);
  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 22, paddingBottom: 120 }}>
      <Text style={{ color: COLORS.cyan, fontSize: 11, fontWeight: '900', letterSpacing: 2 }}>PRACTICE</Text>
      <Text style={{ color: COLORS.text, fontSize: 30, fontWeight: '900', marginTop: 8 }}>Choose a path</Text>
      <Text style={{ color: COLORS.muted, fontSize: 14, lineHeight: 21, marginTop: 7 }}>No giant content catalog. Pick the state or idea you want to work with and begin.</Text>

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 18 }}>
        {DURATIONS.map((value) => <Pressable key={value} onPress={() => setMinutes(value)} style={{ flex: 1, paddingVertical: 10, borderRadius: 13, alignItems: 'center', backgroundColor: minutes === value ? '#24384C' : COLORS.card, borderWidth: 1, borderColor: minutes === value ? COLORS.cyan : COLORS.border }}><Text style={{ color: minutes === value ? COLORS.cyan : COLORS.muted, fontWeight: '900' }}>{value}m</Text></Pressable>)}
      </View>

      <View style={{ marginTop: 18, gap: 11 }}>
        {PRACTICES.map((practice) => (
          <Pressable key={practice.id} accessibilityRole="button" accessibilityLabel={`Start ${practice.title}`} onPress={() => onBegin(composeSession({ intent: practice.intent, goal: practice.goal, minutes, lens }) as SessionPlan)} style={{ backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, padding: 17 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: COLORS.text, fontSize: 19, fontWeight: '900' }}>{practice.title}</Text>
                <Text style={{ color: COLORS.muted, fontSize: 13, lineHeight: 19, marginTop: 4 }}>{practice.subtitle}</Text>
              </View>
              <EvidenceBadge level={practice.evidence} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 13, alignItems: 'center' }}>
              <Text style={{ color: '#858DA8', fontSize: 12 }}>{minutes} min · personalized guidance</Text>
              <Text style={{ color: COLORS.cyan, fontWeight: '900' }}>Start  ›</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
