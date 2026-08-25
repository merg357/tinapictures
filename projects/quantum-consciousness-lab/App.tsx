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
import { AffirmationScreen } from './src/screens/AffirmationScreen';
import { ChallengeScreen } from './src/screens/ChallengeScreen';
import { SoundLibraryScreen } from './src/screens/SoundLibraryScreen';
import {
  loadAffirmationState,
  loadAudioSettings,
  loadChallengeProgress,
  loadLens,
  loadNarrator,
  loadSessions,
  saveAffirmationState,
  saveAudioSettings,
  saveChallengeProgress,
  saveLens,
  saveNarrator,
  saveSessions,
} from './src/lib/storage';
import { COLORS } from './src/theme';
import type {
  AffirmationState,
  AudioSettings,
  ChallengeProgress,
  NarratorId,
  SessionPlan,
  SessionRecord,
  TabKey,
  UserLens,
} from './src/types';

const { DEFAULT_AUDIO_SETTINGS } = require('./src/core/audioModel') as { DEFAULT_AUDIO_SETTINGS: AudioSettings };
const { DEFAULT_AFFIRMATION_STATE } = require('./src/core/affirmationModel') as { DEFAULT_AFFIRMATION_STATE: AffirmationState };
const { DEFAULT_CHALLENGE_PROGRESS } = require('./src/core/challengeModel') as { DEFAULT_CHALLENGE_PROGRESS: ChallengeProgress };

type ToolSurface = 'sounds' | 'affirmations' | 'challenge' | null;

export default function App() {
  const [ready, setReady] = useState(false);
  const [lens, setLens] = useState<UserLens | null>(null);
  const [narrator, setNarrator] = useState<NarratorId>('female');
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({ ...DEFAULT_AUDIO_SETTINGS });
  const [affirmations, setAffirmations] = useState<AffirmationState>({ ...DEFAULT_AFFIRMATION_STATE });
  const [challenge, setChallenge] = useState<ChallengeProgress>({ ...DEFAULT_CHALLENGE_PROGRESS });
  const [tab, setTab] = useState<TabKey>('home');
  const [session, setSession] = useState<SessionPlan | null>(null);
  const [records, setRecords] = useState<SessionRecord[]>([]);
  const [tool, setTool] = useState<ToolSurface>(null);
  const [toolReturn, setToolReturn] = useState<ToolSurface>(null);

  useEffect(() => {
    Promise.all([
      loadLens(),
      loadNarrator(),
      loadAudioSettings(),
      loadAffirmationState(),
      loadChallengeProgress(),
      loadSessions(),
    ]).then(([savedLens, savedNarrator, savedAudio, savedAffirmations, savedChallenge, savedRecords]) => {
      setLens(savedLens);
      setNarrator(savedNarrator);
      setAudioSettings(savedAudio);
      setAffirmations(savedAffirmations);
      setChallenge(savedChallenge);
      setRecords(savedRecords);
      setReady(true);
    });
  }, []);

  async function completeOnboarding(nextLens: UserLens) {
    await saveLens(nextLens);
    setLens(nextLens);
  }

  async function changeNarrator(nextNarrator: NarratorId) {
    setNarrator(nextNarrator);
    await saveNarrator(nextNarrator);
  }

  async function changeAudioSettings(next: AudioSettings) {
    setAudioSettings(next);
    await saveAudioSettings(next);
  }

  async function changeAffirmations(next: AffirmationState) {
    setAffirmations(next);
    await saveAffirmationState(next);
  }

  async function changeChallenge(next: ChallengeProgress) {
    setChallenge(next);
    await saveChallengeProgress(next);
  }

  async function completeSession(record: SessionRecord) {
    const next = [record, ...records].slice(0, 500);
    setRecords(next);
    await saveSessions(next);
    setSession(null);
    if (!tool) setTab('home');
  }

  function openTool(next: Exclude<ToolSurface, null>) {
    setToolReturn(null);
    setTool(next);
  }

  function closeTool() {
    const next = toolReturn;
    setToolReturn(null);
    setTool(next);
  }

  function openAffirmationsFromChallenge() {
    setToolReturn('challenge');
    setTool('affirmations');
  }

  if (!ready) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg }}><StatusBar style="light" /><ActivityIndicator color={COLORS.cyan} /></View>;
  }

  if (!lens) return <><StatusBar style="light" /><OnboardingScreen onComplete={completeOnboarding} /></>;

  if (session) {
    return <><StatusBar style="light" /><SessionScreen plan={session} narrator={narrator} audioSettings={audioSettings} onAudioSettingsChange={changeAudioSettings} onNarratorChange={changeNarrator} onExit={() => setSession(null)} onComplete={completeSession} /></>;
  }

  if (tool === 'affirmations') {
    return <><StatusBar style="light" /><AffirmationScreen state={affirmations} narrator={narrator} audioSettings={audioSettings} onStateChange={changeAffirmations} onNarratorChange={changeNarrator} onAudioSettingsChange={changeAudioSettings} onClose={closeTool} /></>;
  }

  if (tool === 'challenge') {
    return <><StatusBar style="light" /><ChallengeScreen lens={lens} progress={challenge} onProgressChange={changeChallenge} onBegin={setSession} onOpenAffirmations={openAffirmationsFromChallenge} onClose={closeTool} /></>;
  }

  if (tool === 'sounds') {
    return <><StatusBar style="light" /><SoundLibraryScreen audioSettings={audioSettings} onAudioSettingsChange={changeAudioSettings} onClose={closeTool} /></>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        {tab === 'home' && <TodayScreen lens={lens} records={records} onBegin={setSession} />}
        {tab === 'practice' && <PracticeScreen lens={lens} onBegin={setSession} onOpenSounds={() => openTool('sounds')} onOpenAffirmations={() => openTool('affirmations')} onOpenChallenge={() => openTool('challenge')} />}
        {tab === 'explore' && <ExploreScreen />}
        {tab === 'lab' && <LabScreen sessions={records} />}
        {tab === 'journal' && <JournalScreen />}
        <BottomTabs active={tab} onChange={setTab} />
      </View>
    </SafeAreaView>
  );
}
