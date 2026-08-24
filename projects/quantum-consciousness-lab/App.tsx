import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BottomTabs } from './src/components/BottomTabs';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { TodayScreen } from './src/screens/TodayScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { LabScreen } from './src/screens/LabScreen';
import { JournalScreen } from './src/screens/JournalScreen';
import { SessionScreen } from './src/screens/SessionScreen';
import { loadLens, saveLens } from './src/lib/storage';
import { COLORS } from './src/theme';
import type { SessionPlan, TabKey, UserLens } from './src/types';

export default function App() {
  const [ready, setReady] = useState(false);
  const [lens, setLens] = useState<UserLens | null>(null);
  const [tab, setTab] = useState<TabKey>('today');
  const [session, setSession] = useState<SessionPlan | null>(null);

  useEffect(() => {
    loadLens().then((saved) => { setLens(saved); setReady(true); });
  }, []);

  async function completeOnboarding(nextLens: UserLens) {
    await saveLens(nextLens);
    setLens(nextLens);
  }

  if (!ready) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg }}><StatusBar style="light" /><ActivityIndicator color={COLORS.cyan} /></View>;
  }

  if (!lens) return <><StatusBar style="light" /><OnboardingScreen onComplete={completeOnboarding} /></>;
  if (session) return <><StatusBar style="light" /><SessionScreen plan={session} onExit={() => setSession(null)} /></>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        {tab === 'today' && <TodayScreen lens={lens} onBegin={setSession} />}
        {tab === 'explore' && <ExploreScreen />}
        {tab === 'lab' && <LabScreen />}
        {tab === 'journal' && <JournalScreen />}
        <BottomTabs active={tab} onChange={setTab} />
      </View>
    </SafeAreaView>
  );
}
