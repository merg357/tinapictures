import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { COLORS } from '../theme';
import type { JournalEntry } from '../types';
import { createJournalEntry } from '../core/appModel';
import { loadJournal, saveJournal } from '../lib/storage';

const CATEGORIES = ['Reflection', 'Dream', 'Synchronicity', 'Intention'];

export function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [category, setCategory] = useState('Reflection');
  const [text, setText] = useState('');

  useEffect(() => { loadJournal().then(setEntries); }, []);

  async function addEntry() {
    if (!text.trim()) return;
    const entry = createJournalEntry({ category, text }) as JournalEntry;
    const next = [entry, ...entries].slice(0, 200);
    setEntries(next);
    setText('');
    await saveJournal(next);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 22, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
      <Text style={{ color: COLORS.cyan, fontSize: 11, fontWeight: '800', letterSpacing: 2 }}>PRIVATE JOURNAL</Text>
      <Text style={{ color: COLORS.text, fontSize: 30, fontWeight: '800', marginTop: 10 }}>Notice what repeats.</Text>
      <Text style={{ color: COLORS.muted, lineHeight: 21, marginTop: 8 }}>V0.1 keeps these entries on this device. They are not sent to analytics or an AI service.</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 20 }}>
        {CATEGORIES.map((item) => <Pressable key={item} onPress={() => setCategory(item)} style={{ paddingHorizontal: 11, paddingVertical: 8, borderRadius: 999, backgroundColor: category === item ? '#2C2350' : COLORS.card, borderWidth: 1, borderColor: category === item ? COLORS.violet : COLORS.border }}><Text style={{ color: category === item ? COLORS.text : COLORS.muted, fontSize: 12, fontWeight: '700' }}>{item}</Text></Pressable>)}
      </View>

      <TextInput
        value={text}
        onChangeText={setText}
        multiline
        placeholder={category === 'Dream' ? 'What do you remember?' : category === 'Synchronicity' ? 'What happened, and what made it feel meaningful?' : 'What did you notice?'}
        placeholderTextColor="#68708C"
        style={{ minHeight: 130, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, padding: 16, marginTop: 14, color: COLORS.text, fontSize: 15, textAlignVertical: 'top', lineHeight: 21 }}
      />
      <Pressable disabled={!text.trim()} onPress={addEntry} style={{ marginTop: 12, paddingVertical: 14, borderRadius: 15, alignItems: 'center', backgroundColor: text.trim() ? COLORS.violet : '#303447' }}><Text style={{ color: text.trim() ? '#FFFFFF' : '#777D92', fontWeight: '900' }}>Save privately</Text></Pressable>

      <View style={{ marginTop: 25, gap: 10 }}>
        {entries.map((entry) => (
          <View key={entry.id} style={{ backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}><Text style={{ color: COLORS.cyan, fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>{entry.category.toUpperCase()}</Text><Text style={{ color: '#727994', fontSize: 11 }}>{new Date(entry.createdAt).toLocaleString()}</Text></View>
            <Text style={{ color: COLORS.text, lineHeight: 21, marginTop: 9 }}>{entry.text}</Text>
          </View>
        ))}
        {entries.length === 0 && <Text style={{ color: '#727994', textAlign: 'center', marginTop: 20 }}>Your first reflection will appear here.</Text>}
      </View>
    </ScrollView>
  );
}
