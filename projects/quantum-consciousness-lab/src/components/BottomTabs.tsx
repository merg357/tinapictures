import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { COLORS } from '../theme';
import type { TabKey } from '../types';

const TABS: Array<{ id: TabKey; label: string; glyph: string }> = [
  { id: 'home', label: 'Home', glyph: '●' },
  { id: 'practice', label: 'Practice', glyph: '◌' },
  { id: 'explore', label: 'Explore', glyph: '◇' },
  { id: 'lab', label: 'Lab', glyph: '⌁' },
  { id: 'journal', label: 'Journal', glyph: '✦' },
];

export function BottomTabs({ active, onChange }: { active: TabKey; onChange: (tab: TabKey) => void }) {
  return (
    <View style={{ position: 'absolute', left: 10, right: 10, bottom: 10, flexDirection: 'row', backgroundColor: '#101425FA', borderWidth: 1, borderColor: COLORS.border, borderRadius: 22, paddingVertical: 7, paddingHorizontal: 3 }}>
      {TABS.map((tab) => {
        const selected = active === tab.id;
        return (
          <Pressable accessibilityRole="button" accessibilityLabel={tab.label} key={tab.id} onPress={() => onChange(tab.id)} style={{ flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 15, backgroundColor: selected ? '#252B48' : 'transparent' }}>
            <Text style={{ color: selected ? COLORS.cyan : '#737B99', fontSize: 16 }}>{tab.glyph}</Text>
            <Text numberOfLines={1} style={{ color: selected ? COLORS.text : COLORS.muted, fontSize: 9.5, fontWeight: selected ? '800' : '600', marginTop: 2 }}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
