import React from 'react';
import { Text, View } from 'react-native';
import { EVIDENCE_COLORS } from '../data/content';
import type { EvidenceLevel } from '../types';

export function EvidenceBadge({ level }: { level: EvidenceLevel | string }) {
  const color = EVIDENCE_COLORS[level as EvidenceLevel] ?? '#A8AEC5';
  return (
    <View style={{ alignSelf: 'flex-start', borderWidth: 1, borderColor: `${color}66`, backgroundColor: `${color}18`, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
      <Text style={{ color, fontSize: 11, fontWeight: '700', letterSpacing: 0.4 }}>{level}</Text>
    </View>
  );
}
