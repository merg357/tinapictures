import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BreathOrb } from '../components/BreathOrb';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { AudioMixerControls } from '../components/AudioMixerControls';
import { COLORS } from '../theme';
import type { AudioSettings, NarratorId, SessionPlan, SessionRecord } from '../types';
import { NARRATOR_LABELS } from '../voice/voiceManifest';
import { useMeditationPlayer } from '../voice/useMeditationPlayer';
import { useMeditationMixer } from '../audio/useMeditationMixer';
import { selectedSoundLabels } from '../audio/soundManifest';

const RATING_VALUES = [1,2,3,4,5,6,7,8,9,10];

export function SessionScreen({ plan, narrator, audioSettings, onAudioSettingsChange, onNarratorChange, onExit, onComplete }: {
  plan: SessionPlan;
  narrator: NarratorId;
  audioSettings: AudioSettings;
  onAudioSettingsChange: (settings: AudioSettings) => void | Promise<void>;
  onNarratorChange: (narrator: NarratorId) => void | Promise<void>;
  onExit: () => void;
  onComplete: (record: SessionRecord) => void;
}) {
  const totalSeconds = plan.minutes * 60;
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [reflecting, setReflecting] = useState(false);
  const [before, setBefore] = useState(6);
  const [after, setAfter] = useState(4);

  const currentIndex = useMemo(() => {
    let cursor = 0;
    for (let i = 0; i < plan.segments.length; i += 1) {
      cursor += plan.segments[i].minutes * 60;
      if (elapsed < cursor) return i;
    }
    return plan.segments.length - 1;
  }, [elapsed, plan.segments]);
  const current = plan.segments[currentIndex];
  const finished = elapsed >= totalSeconds;
  const minimalGuidance = audioSettings.guidanceLevel === 'less';

  const narration = useMeditationPlayer({
    practiceId: plan.pathId,
    narratorId: narrator,
    segmentIndex: currentIndex,
    started,
    running,
    reflecting,
    finished,
    minimalGuidance,
    narrationVolume: audioSettings.narrationVolume,
  });

  const mixer = useMeditationMixer({
    settings: audioSettings,
    narrationActive: narration.isNarrating,
    started,
    running,
    reflecting,
    finished,
  });

  useEffect(() => {
    if (!started || !running || finished || reflecting) return;
    const timer = setInterval(() => setElapsed((value) => Math.min(value + 1, totalSeconds)), 1000);
    return () => clearInterval(timer);
  }, [finished, reflecting, running, started, totalSeconds]);

  useEffect(() => {
    if (!started || !running || reflecting || finished) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
  }, [currentIndex, finished, reflecting, running, started]);

  useEffect(() => {
    if (!finished || reflecting) return;
    setRunning(false);
    narration.stop();
    mixer.stop();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    setReflecting(true);
  }, [finished, narration.stop, reflecting]);

  function chooseNarrator(next: NarratorId) {
    onNarratorChange(next);
    narration.preview(next);
  }

  function changeAudio(next: AudioSettings) {
    onAudioSettingsChange(next);
  }

  function begin() {
    narration.stop();
    setElapsed(0);
    setStarted(true);
    setRunning(true);
  }

  function endAndReflect() {
    narration.stop();
    mixer.stop();
    setRunning(false);
    setReflecting(true);
  }

  function saveAndFinish() {
    narration.stop();
    mixer.stop();
    onComplete({ id:`session-${Date.now()}`, pathId:plan.pathId, title:plan.title, minutes:Math.max(1, Math.round(elapsed / 60)) || plan.minutes, before, after, completed:finished || elapsed >= 30, createdAt:Date.now() });
  }

  const remaining = Math.max(0, totalSeconds - elapsed);
  const mm = Math.floor(remaining / 60).toString().padStart(2,'0');
  const ss = (remaining % 60).toString().padStart(2,'0');
  const breathVisual = /(breath|settle|regulate|arrive|exhale|heart)/i.test(current.title);
  const labels = selectedSoundLabels(audioSettings);

  if (!started) return <SafeAreaView style={{ flex:1, backgroundColor:COLORS.bg }}><ScrollView contentContainerStyle={{ padding:22, paddingTop:30, paddingBottom:44 }}>
    <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}><Pressable onPress={() => { narration.stop(); mixer.stop(); onExit(); }}><Text style={{ color:COLORS.muted, fontWeight:'800' }}>Close</Text></Pressable><EvidenceBadge level={plan.evidence}/></View>
    <Text style={{ color:COLORS.cyan, fontSize:11, letterSpacing:2, fontWeight:'900', marginTop:30 }}>BEFORE YOU BEGIN</Text>
    <Text style={{ color:COLORS.text, fontSize:31, fontWeight:'900', marginTop:9 }}>{plan.title}</Text>
    <Text style={{ color:COLORS.muted, fontSize:14, lineHeight:21, marginTop:7 }}>{plan.rationale}</Text>
    <Text style={{ color:COLORS.text, fontSize:17, fontWeight:'900', marginTop:25 }}>How activated or unsettled do you feel?</Text>
    <Text style={{ color:COLORS.muted, marginTop:5 }}>1 = very settled · 10 = extremely activated</Text>
    <View style={{ flexDirection:'row', flexWrap:'wrap', gap:7, marginTop:14 }}>{RATING_VALUES.map((value) => <Pressable key={value} onPress={() => setBefore(value)} style={{ width:42,height:42,borderRadius:13,alignItems:'center',justifyContent:'center',backgroundColor:before===value?'#E9E7FF':COLORS.card,borderWidth:1,borderColor:before===value?'#E9E7FF':COLORS.border }}><Text style={{ color:before===value?'#121529':COLORS.muted,fontWeight:'900' }}>{value}</Text></Pressable>)}</View>

    <View style={{ backgroundColor:COLORS.card,borderRadius:17,borderWidth:1,borderColor:COLORS.border,padding:14,marginTop:20 }}>
      <Text style={{ color:COLORS.muted,fontSize:11,fontWeight:'800' }}>NATURAL NARRATOR</Text>
      <View style={{ flexDirection:'row',gap:8,marginTop:10 }}>{(['female','male'] as NarratorId[]).map((id)=><Pressable key={id} accessibilityRole="button" accessibilityLabel={`Narrator ${NARRATOR_LABELS[id]}`} onPress={()=>chooseNarrator(id)} style={{ flex:1,paddingVertical:12,alignItems:'center',borderRadius:13,backgroundColor:narrator===id?'#272348':COLORS.bg,borderWidth:1,borderColor:narrator===id?COLORS.violet:COLORS.border }}><Text style={{ color:COLORS.text,fontWeight:'900' }}>{NARRATOR_LABELS[id]}</Text><Text style={{ color:'#7D86A5',fontSize:11,marginTop:3 }}>Tap to preview</Text></Pressable>)}</View>
      <Text style={{ color:'#7D86A5',fontSize:12,lineHeight:17,marginTop:10 }}>Natural neural narration is stored with the app. Android system TTS is not used.</Text>
      <Text accessibilityLabel="Narration preview state" style={{ color:narration.state==='error'?'#FF9B9B':COLORS.cyan,fontSize:12,marginTop:8 }}>Natural narration · {narration.state}</Text>
    </View>

    <AudioMixerControls settings={audioSettings} onChange={changeAudio}/>
    <View style={{ flexDirection:'row',gap:8,marginTop:12 }}><Pressable accessibilityRole="button" accessibilityLabel="Full Guidance" onPress={()=>changeAudio({...audioSettings,guidanceLevel:'full'})} style={{ flex:1,paddingVertical:11,alignItems:'center',borderRadius:13,backgroundColor:audioSettings.guidanceLevel==='full'?'#272348':COLORS.card,borderWidth:1,borderColor:audioSettings.guidanceLevel==='full'?COLORS.violet:COLORS.border }}><Text style={{ color:COLORS.text,fontWeight:'800' }}>Full Guidance</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Less Guidance" onPress={()=>changeAudio({...audioSettings,guidanceLevel:'less'})} style={{ flex:1,paddingVertical:11,alignItems:'center',borderRadius:13,backgroundColor:audioSettings.guidanceLevel==='less'?'#272348':COLORS.card,borderWidth:1,borderColor:audioSettings.guidanceLevel==='less'?COLORS.violet:COLORS.border }}><Text style={{ color:COLORS.text,fontWeight:'800' }}>Less Guidance</Text></Pressable></View>
    <Text style={{ color:'#79819E',fontSize:11,lineHeight:16,marginTop:8 }}>Less Guidance reduces spoken prompts but keeps your selected music, nature sound or frequency layer playing through the quiet intervals.</Text>
    <Pressable accessibilityRole="button" accessibilityLabel={`Start ${plan.title}`} onPress={begin} style={{ backgroundColor:'#F4F2FF',paddingVertical:16,borderRadius:17,alignItems:'center',marginTop:20 }}><Text style={{ color:'#111427',fontSize:16,fontWeight:'900' }}>Start {plan.minutes}-Minute Practice</Text></Pressable>
  </ScrollView></SafeAreaView>;

  if (reflecting) return <SafeAreaView style={{ flex:1,backgroundColor:COLORS.bg }}><ScrollView contentContainerStyle={{ padding:22,paddingTop:42,paddingBottom:40 }}>
    <Text style={{ color:COLORS.cyan,fontSize:11,letterSpacing:2,fontWeight:'900' }}>NOTICE THE CHANGE</Text>
    <Text style={{ color:COLORS.text,fontSize:31,fontWeight:'900',marginTop:9 }}>How do you feel now?</Text>
    <Text style={{ color:COLORS.muted,fontSize:14,lineHeight:21,marginTop:7 }}>Use the same scale. This is a personal observation, not proof that the practice caused the change.</Text>
    <View style={{ flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:20 }}>{RATING_VALUES.map((value)=><Pressable key={value} onPress={()=>setAfter(value)} style={{ width:42,height:42,borderRadius:13,alignItems:'center',justifyContent:'center',backgroundColor:after===value?'#E9E7FF':COLORS.card,borderWidth:1,borderColor:after===value?'#E9E7FF':COLORS.border }}><Text style={{ color:after===value?'#121529':COLORS.muted,fontWeight:'900' }}>{value}</Text></Pressable>)}</View>
    <View style={{ flexDirection:'row',gap:10,marginTop:24 }}><View style={{ flex:1,backgroundColor:COLORS.card,borderRadius:17,padding:15 }}><Text style={{ color:COLORS.muted,fontSize:11 }}>BEFORE</Text><Text style={{ color:COLORS.text,fontSize:27,fontWeight:'900',marginTop:4 }}>{before}</Text></View><View style={{ flex:1,backgroundColor:COLORS.card,borderRadius:17,padding:15 }}><Text style={{ color:COLORS.muted,fontSize:11 }}>AFTER</Text><Text style={{ color:COLORS.green,fontSize:27,fontWeight:'900',marginTop:4 }}>{after}</Text></View></View>
    <Pressable accessibilityRole="button" accessibilityLabel="Save session and finish" onPress={saveAndFinish} style={{ backgroundColor:'#F4F2FF',paddingVertical:16,borderRadius:17,alignItems:'center',marginTop:20 }}><Text style={{ color:'#111427',fontSize:16,fontWeight:'900' }}>Save & Finish</Text></Pressable>
    <Pressable onPress={()=>{narration.stop();mixer.stop();onExit();}} style={{ paddingVertical:14,alignItems:'center',marginTop:6 }}><Text style={{ color:COLORS.muted,fontWeight:'800' }}>Discard</Text></Pressable>
  </ScrollView></SafeAreaView>;

  return <SafeAreaView style={{ flex:1,backgroundColor:COLORS.bg }}><ScrollView contentContainerStyle={{ padding:22,paddingTop:28,paddingBottom:40 }}>
    <View style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center' }}><Pressable onPress={endAndReflect}><Text style={{ color:COLORS.muted,fontWeight:'800' }}>End</Text></Pressable><EvidenceBadge level={plan.evidence}/></View>
    <Text style={{ color:COLORS.cyan,fontSize:11,letterSpacing:2,fontWeight:'900',marginTop:28 }}>CURRENT PRACTICE</Text>
    <Text style={{ color:COLORS.text,fontSize:31,fontWeight:'900',marginTop:8 }}>{plan.title}</Text>
    <Text style={{ color:COLORS.muted,marginTop:6 }}>{current.title}</Text>
    {breathVisual?<BreathOrb active={running}/>:<View style={{ height:210,alignItems:'center',justifyContent:'center' }}><View style={{ width:142,height:142,borderRadius:71,borderWidth:1,borderColor:'#695DE0AA',backgroundColor:'#312E8122',alignItems:'center',justifyContent:'center' }}><Text style={{ color:COLORS.cyan,fontSize:12,letterSpacing:1.4 }}>AWARENESS</Text></View></View>}
    <Text style={{ color:COLORS.text,fontSize:42,fontVariant:['tabular-nums'],textAlign:'center',fontWeight:'800' }}>{mm}:{ss}</Text>
    <Text style={{ color:COLORS.muted,fontSize:14,lineHeight:21,textAlign:'center',marginTop:14 }}>{current.prompt}</Text>
    <Text accessibilityLabel="Natural narration playback state" style={{ color:narration.state==='error'?'#FF9B9B':COLORS.cyan,fontSize:12,textAlign:'center',marginTop:12 }}>Natural narration · {narration.state}</Text>
    <Text accessibilityLabel="Meditation mixer playback state" style={{ color:mixer.state==='error'?'#FF9B9B':COLORS.green,fontSize:12,textAlign:'center',marginTop:5 }}>Meditation sound · {mixer.state} · {labels.background} · {labels.frequency}</Text>
    {(narration.error||mixer.error)?<Text style={{ color:'#FF9B9B',fontSize:11,textAlign:'center',marginTop:4 }}>{narration.error||mixer.error}</Text>:null}
    <View style={{ height:5,borderRadius:999,backgroundColor:'#22273A',overflow:'hidden',marginTop:24 }}><View style={{ width:`${Math.min(100,(elapsed/totalSeconds)*100)}%`,height:'100%',backgroundColor:COLORS.violet }}/></View>
    <View style={{ flexDirection:'row',gap:10,marginTop:24 }}><Pressable accessibilityRole="button" accessibilityLabel={running?'Pause meditation':'Resume meditation'} onPress={()=>setRunning((value)=>!value)} style={{ flex:1,backgroundColor:'#F5F3FF',paddingVertical:15,alignItems:'center',borderRadius:16 }}><Text style={{ color:'#111327',fontWeight:'900' }}>{running?'Pause':'Resume'}</Text></Pressable><Pressable onPress={endAndReflect} style={{ flex:1,borderWidth:1,borderColor:COLORS.border,paddingVertical:15,alignItems:'center',borderRadius:16 }}><Text style={{ color:COLORS.text,fontWeight:'800' }}>End & Reflect</Text></Pressable></View>
    <Text numberOfLines={2} style={{ color:'#737C99',fontSize:11,textAlign:'center',marginTop:15 }}>Voice: {NARRATOR_LABELS[narrator]} · {minimalGuidance?'less guidance':'full guidance'} · Background: {labels.background} · Frequency: {labels.frequency}</Text>
  </ScrollView></SafeAreaView>;
}
