import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BottomTabs } from './src/components/BottomTabs';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { TodayScreen } from './src/screens/TodayScreen';
import { PracticeScreen } from './src/screens/PracticeScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { LabScreen } from './src/screens/LabScreen';
import { JournalScreen } from './src/screens/JournalScreen';
import { SessionScreen } from './src/screens/SessionScreen';
import { loadLens, loadSessions, saveLens, saveSessions } from './src/lib/storage';
import { COLORS } from './src/theme';
import type { SessionPlan, SessionRecord, TabKey, UserLens } from './src/types';

export default function App() {
  const [ready, setReady] = useState(false);
  const [lens, setLens] = useState<UserLens | null>(null);
  const [tab, setTab] = useState<TabKey>('home');
  const [session, setSession] = useState<SessionPlan | null>(null);
  const [records, setRecords] = useState<SessionRecord[]>([]);

  useEffect(() => {
    Promise.all([loadLens(), loadSessions()]).then(([savedLens, savedRecords]) => {
      setLens(savedLens);
      setRecords(savedRecords);
      setReady(true);
    });
  }, []);

  async function completeOnboarding(nextLens: UserLens) {
    await saveLens(nextLens);
    setLens(nextLens);
  }

  async function completeSession(record: SessionRecord) {
    const next = [record, ...records].slice(0, 500);
    setRecords(next);
    await saveSessions(next);
    setSession(null);
    setTab('home');
  }

  if (!ready) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg }}><StatusBar style="light" /><ActivityIndicator color={COLORS.cyan} /></View>;
  if (!lens) return <><StatusBar style="light" /><OnboardingScreen onComplete={completeOnboarding} /></>;
  if (session) return <><StatusBar style="light" /><SessionScreen plan={session} onExit={() => setSession(null)} onComplete={completeSession} /></>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        {tab === 'home' && <TodayScreen lens={lens} records={records} onBegin={setSession} />}
        {tab === 'practice' && <PracticeScreen lens={lens} onBegin={setSession} />}
        {tab === 'explore' && <ExploreScreen />}
        {tab === 'lab' && <LabScreen sessions={records} />}
        {tab === 'journal' && <JournalScreen />}
        <BottomTabs active={tab} onChange={setTab} />
      </View>
    </SafeAreaView>
  );
}
