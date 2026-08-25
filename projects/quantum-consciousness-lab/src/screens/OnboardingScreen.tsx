import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LENS_OPTIONS } from '../data/content';
import { COLORS } from '../theme';
import type { UserLens } from '../types';

export function OnboardingScreen({ onComplete }: { onComplete: (lens: UserLens) => void | Promise<void> }) {
  const [lens, setLens] = useState<UserLens>('science-frontier');

  return (
    <LinearGradient colors={['#080A12', '#101331', '#080A12']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 50, paddingBottom: 40 }}>
          <Text style={{ color: COLORS.cyan, fontSize: 12, letterSpacing: 2.2, fontWeight: '800' }}>CONSCIOUSNESS LAB</Text>
          <Text style={{ color: COLORS.text, fontSize: 34, lineHeight: 40, fontWeight: '800', marginTop: 14 }}>Explore the mind. Test the experience.</Text>
          <Text style={{ color: COLORS.muted, fontSize: 16, lineHeight: 24, marginTop: 14 }}>Meditation, neuroscience, quantum foundations, altered states, intention, dreams, and the unknown — with the evidence kept visible.</Text>

          <View style={{ marginTop: 30 }}>
            <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Choose your lens</Text>
            {LENS_OPTIONS.map((option) => {
              const selected = option.id === lens;
              return (
                <Pressable key={option.id} onPress={() => setLens(option.id)} style={{ borderWidth: 1, borderColor: selected ? COLORS.violet : COLORS.border, backgroundColor: selected ? '#281F4A' : COLORS.card, borderRadius: 18, padding: 18, marginBottom: 12 }}>
                  <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '700' }}>{option.title}</Text>
                  <Text style={{ color: COLORS.muted, fontSize: 13, lineHeight: 19, marginTop: 5 }}>{option.subtitle}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={{ backgroundColor: '#111827', borderRadius: 16, padding: 15, marginTop: 10, borderWidth: 1, borderColor: '#26314B' }}>
            <Text style={{ color: COLORS.cyan, fontSize: 12, fontWeight: '800' }}>THE RULE</Text>
            <Text style={{ color: COLORS.text, lineHeight: 20, marginTop: 6 }}>Extraordinary possibilities are welcome. Possibility is never presented as proof.</Text>
          </View>

          <Pressable onPress={() => onComplete(lens)} style={{ backgroundColor: COLORS.violet, borderRadius: 18, paddingVertical: 17, alignItems: 'center', marginTop: 28 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>Enter the Lab</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
