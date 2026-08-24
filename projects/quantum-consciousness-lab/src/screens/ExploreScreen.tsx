import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { COLORS } from '../theme';
import { FLAGSHIP_PATHS } from '../core/appModel';

export function ExploreScreen() {
  const [expanded, setExpanded] = useState<string | null>('quantum-foundations');
  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 22, paddingBottom: 120 }}>
      <Text style={{ color: COLORS.cyan, fontSize: 11, fontWeight: '800', letterSpacing: 2 }}>EXPLORE</Text>
      <Text style={{ color: COLORS.text, fontSize: 30, fontWeight: '800', marginTop: 10 }}>Science, frontier, and mystery.</Text>
      <Text style={{ color: COLORS.muted, lineHeight: 21, marginTop: 8 }}>The evidence label stays visible so an interesting idea never quietly turns into a scientific claim.</Text>
      <View style={{ gap: 12, marginTop: 22 }}>
        {FLAGSHIP_PATHS.map((path: any) => {
          const open = expanded === path.id;
          return (
            <Pressable key={path.id} onPress={() => setExpanded(open ? null : path.id)} style={{ backgroundColor: COLORS.card, borderWidth: 1, borderColor: open ? '#4B4F82' : COLORS.border, borderRadius: 20, padding: 17 }}>
              <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}><Text style={{ color: COLORS.text, fontSize: 19, fontWeight: '800' }}>{path.title}</Text><Text style={{ color: COLORS.muted, fontSize: 13, lineHeight: 19, marginTop: 4 }}>{path.subtitle}</Text></View>
                <EvidenceBadge level={path.evidence} />
              </View>
              {open && <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 14 }}>
                <Text style={{ color: COLORS.cyan, fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>WHAT WE KNOW</Text>
                <Text style={{ color: COLORS.text, lineHeight: 20, marginTop: 6 }}>{path.whatWeKnow}</Text>
                <Text style={{ color: COLORS.rose, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 15 }}>EXPLORE WITHOUT OVERCLAIMING</Text>
                <Text style={{ color: COLORS.muted, lineHeight: 20, marginTop: 6 }}>{path.explore}</Text>
              </View>}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
