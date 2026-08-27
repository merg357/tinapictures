import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { COLORS } from '../theme';
import type { EvidenceLevel, SessionPlan, UserLens } from '../types';
import { composeSession } from '../core/sessionComposer';
import { V04_TOOLS } from '../core/appModel';

type Practice = {
  id: string;
  title: string;
  subtitle: string;
  evidence: EvidenceLevel;
  goal: string;
  intent: string;
  minutes?: number;
  group: 'Core' | 'Rewire & Embodiment';
};

const PRACTICES: Practice[] = [
  { id: 'coherence', title: 'Coherence', subtitle: 'Slow breathing + nervous-system settling', evidence: 'Supported', goal: 'Calm', intent: 'I feel stressed and want coherence breathing', group: 'Core' },
  { id: 'deep-rest', title: 'Deep Rest', subtitle: 'Low-guidance body release for sleep', evidence: 'Supported', goal: 'Sleep', intent: 'I want deep rest and sleep', group: 'Core' },
  { id: 'observer', title: 'Observer', subtitle: 'Step out of repetitive thoughts', evidence: 'Established', goal: 'Reset', intent: 'I am overthinking and want observer practice', group: 'Core' },
  { id: 'intention', title: 'Intention', subtitle: 'Visualization + concrete next action', evidence: 'Supported', goal: 'Intention', intent: 'I want to visualize a goal and set an intention', group: 'Core' },
  { id: 'quantum-foundations', title: 'Quantum Foundations', subtitle: 'Meditation paired with accurate quantum concepts', evidence: 'Established', goal: 'Quantum', intent: 'I want to explore quantum physics and observation', group: 'Core' },
  { id: 'expanded-consciousness', title: 'Expanded Consciousness', subtitle: 'Hypnagogia, open awareness + deep quiet', evidence: 'Emerging', goal: 'Go Deep', intent: 'I want to go deep into expanded consciousness', group: 'Core' },
  { id: 'synchronicity-dreams', title: 'Synchronicity & Dreams', subtitle: 'Symbols, meaning + multiple explanatory lenses', evidence: 'Philosophical', goal: 'Dreams', intent: 'I want to explore a dream or synchronicity', group: 'Core' },
  { id: 'spacious-awareness', title: 'Spacious Awareness', subtitle: 'Open-focus attention + sense of space', evidence: 'Emerging', goal: 'Go Deep', intent: 'open spacious awareness and sense the space around my body', group: 'Rewire & Embodiment' },
  { id: 'breaking-pattern', title: 'Breaking the Pattern', subtitle: 'Recognize, interrupt, redirect, rehearse', evidence: 'Supported', goal: 'Reset', intent: 'break an old pattern and interrupt my automatic reaction', group: 'Rewire & Embodiment' },
  { id: 'heart-coherence', title: 'Heart Coherence', subtitle: 'Slow breath + heart-area attention + gratitude', evidence: 'Supported', goal: 'Calm', intent: 'heart focused breathing and coherence', group: 'Rewire & Embodiment' },
  { id: 'future-self', title: 'Future Self', subtitle: 'Mental rehearsal tied to real behavior', evidence: 'Supported', goal: 'Intention', intent: 'rehearse my future self identity', group: 'Rewire & Embodiment' },
  { id: 'become-future-you', title: 'Become the Future You', subtitle: 'Full guided meditation using your approved script', evidence: 'Supported', goal: 'Intention', intent: 'become the future you approved future meditation', minutes: 30, group: 'Rewire & Embodiment' },
  { id: 'energy-centers', title: 'Energy Center Journey', subtitle: 'Body-region attention with spiritual framing', evidence: 'Spiritual / Experiential', goal: 'Go Deep', intent: 'energy center journey through the body', group: 'Rewire & Embodiment' },
  { id: 'new-potentials', title: 'New Possibilities', subtitle: 'Imagine a possible future without guarantee claims', evidence: 'Theoretical', goal: 'Intention', intent: 'tune in to new possibilities and potential', group: 'Rewire & Embodiment' },
  { id: 'walking-embodiment', title: 'Walking Embodiment', subtitle: 'Practice identity through posture, pace and movement', evidence: 'Supported', goal: 'Focus', intent: 'walking meditation embody my new self', group: 'Rewire & Embodiment' },
  { id: 'gratitude-receiving', title: 'Gratitude & Receiving', subtitle: 'Specific gratitude + receptive attention', evidence: 'Supported', goal: 'Calm', intent: 'gratitude and receiving practice', group: 'Rewire & Embodiment' },
  { id: 'deep-sleep-integration', title: 'Deep Sleep Integration', subtitle: 'Release the day + gentle pre-sleep rehearsal', evidence: 'Supported', goal: 'Sleep', intent: 'sleep integration and overnight rest', group: 'Rewire & Embodiment' },
  { id: 'abundance-identity', title: 'Abundance Identity', subtitle: 'Resourcefulness, value creation + opportunity attention', evidence: 'Supported', goal: 'Intention', intent: 'abundance identity and prosperity mindset', group: 'Rewire & Embodiment' },
  { id: 'purpose-direction', title: 'Purpose & Direction', subtitle: 'Clarify what matters + one next action', evidence: 'Supported', goal: 'Focus', intent: 'purpose and direction for my next step', group: 'Rewire & Embodiment' },
  { id: 'stress-stillness', title: 'Stress-to-Stillness', subtitle: 'Fast downshift using breath, release + broad attention', evidence: 'Supported', goal: 'Calm', intent: 'stress to stillness right now', group: 'Rewire & Embodiment' },
];

const DURATIONS = [5, 10, 15, 20];

export function PracticeScreen({
  lens,
  onBegin,
  onOpenSounds,
  onOpenAffirmations,
  onOpenChallenge,
}: {
  lens: UserLens;
  onBegin: (plan: SessionPlan) => void;
  onOpenSounds: () => void;
  onOpenAffirmations: () => void;
  onOpenChallenge: () => void;
}) {
  const [minutes, setMinutes] = useState(10);
  const openers: Record<string, () => void> = {
    sounds: onOpenSounds,
    affirmations: onOpenAffirmations,
    challenge: onOpenChallenge,
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 22, paddingBottom: 120 }}>
      <Text style={{ color: COLORS.cyan, fontSize: 11, fontWeight: '900', letterSpacing: 2 }}>PRACTICE</Text>
      <Text style={{ color: COLORS.text, fontSize: 30, fontWeight: '900', marginTop: 8 }}>Choose a path</Text>
      <Text style={{ color: COLORS.muted, fontSize: 14, lineHeight: 21, marginTop: 7 }}>Meditation, soundscapes, affirmations, and a structured 32-day practice are all available here.</Text>

      <Text style={{ color: COLORS.text, fontSize: 17, fontWeight: '900', marginTop: 20 }}>V0.4 tools</Text>
      <View style={{ gap: 9, marginTop: 10 }}>
        {V04_TOOLS.map((tool: any) => (
          <Pressable
            key={tool.id}
            accessibilityRole="button"
            accessibilityLabel={`Open ${tool.title}`}
            onPress={openers[tool.id]}
            style={{ backgroundColor: '#171B30', borderWidth: 1, borderColor: '#3B4168', borderRadius: 18, padding: 15 }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: '900' }}>{tool.title}</Text>
                <Text style={{ color: COLORS.muted, fontSize: 12.5, lineHeight: 18, marginTop: 4 }}>{tool.subtitle}</Text>
              </View>
              <Text style={{ color: COLORS.cyan, fontWeight: '900' }}>Open ›</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Text style={{ color: COLORS.text, fontSize: 17, fontWeight: '900', marginTop: 22 }}>Meditation length</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
        {DURATIONS.map((value) => (
          <Pressable key={value} onPress={() => setMinutes(value)} style={{ flex: 1, paddingVertical: 10, borderRadius: 13, alignItems: 'center', backgroundColor: minutes === value ? '#24384C' : COLORS.card, borderWidth: 1, borderColor: minutes === value ? COLORS.cyan : COLORS.border }}>
            <Text style={{ color: minutes === value ? COLORS.cyan : COLORS.muted, fontWeight: '900' }}>{value}m</Text>
          </Pressable>
        ))}
      </View>

      {(['Core', 'Rewire & Embodiment'] as const).map((group) => (
        <View key={group} style={{ marginTop: 22 }}>
          <Text style={{ color: group === 'Core' ? COLORS.cyan : COLORS.violet, fontSize: 12, fontWeight: '900', letterSpacing: 1.2 }}>{group.toUpperCase()}</Text>
          <View style={{ marginTop: 10, gap: 10 }}>
            {PRACTICES.filter((practice) => practice.group === group).map((practice) => (
              <Pressable
                key={practice.id}
                accessibilityRole="button"
                accessibilityLabel={`Start ${practice.title}`}
                onPress={() => onBegin(composeSession({ intent: practice.intent, goal: practice.goal, minutes: practice.minutes ?? minutes, lens }) as SessionPlan)}
                style={{ backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, padding: 16 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: '900' }}>{practice.title}</Text>
                    <Text style={{ color: COLORS.muted, fontSize: 13, lineHeight: 19, marginTop: 4 }}>{practice.subtitle}</Text>
                  </View>
                  <EvidenceBadge level={practice.evidence} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                  <Text style={{ color: '#858DA8', fontSize: 12 }}>{practice.minutes ?? minutes} min · natural voice + soundscape</Text>
                  <Text style={{ color: COLORS.cyan, fontWeight: '900' }}>Start ›</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
