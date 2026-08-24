import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { COLORS } from '../theme';
import type { TabKey } from '../types';

const TABS: Array<{ id: TabKey; label: string; glyph: string }> = [
  { id: 'today', label: 'Today', glyph: '◉' },
  { id: 'explore', label: 'Explore', glyph: '◇' },
  { id: 'lab', label: 'Lab', glyph: '⌁' },
  { id: 'journal', label: 'Journal', glyph: '✦' },
];

export function BottomTabs({ active, onChange }: { active: TabKey; onChange: (tab: TabKey) => void }) {
  return (
    <View style={{ position: 'absolute', left: 14, right: 14, bottom: 12, flexDirection: 'row', backgroundColor: '#111526F2', borderWidth: 1, borderColor: COLORS.border, borderRadius: 24, paddingVertical: 8, paddingHorizontal: 4 }}>
      {TABS.map((tab) => {
        const selected = active === tab.id;
        return (
          <Pressable key={tab.id} onPress={() => onChange(tab.id)} style={{ flex: 1, alignItems: 'center', paddingVertical: 7, borderRadius: 16, backgroundColor: selected ? '#24294A' : 'transparent' }}>
            <Text style={{ color: selected ? COLORS.cyan : COLORS.muted, fontSize: 18 }}>{tab.glyph}</Text>
            <Text style={{ color: selected ? COLORS.text : COLORS.muted, fontSize: 11, fontWeight: selected ? '700' : '500', marginTop: 2 }}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
