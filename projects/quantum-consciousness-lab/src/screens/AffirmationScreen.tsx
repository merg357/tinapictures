import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { COLORS } from '../theme';
import type { AffirmationCadence, AffirmationMode, AffirmationState, AffirmationStyle, AudioSettings, NarratorId } from '../types';
import { AFFIRMATION_CATEGORIES, AFFIRMATIONS } from '../data/affirmations';
import { NARRATOR_LABELS } from '../voice/voiceManifest';
import { useAffirmationPlayer } from '../voice/useAffirmationPlayer';
import { useMeditationMixer } from '../audio/useMeditationMixer';
import { AudioMixerControls } from '../components/AudioMixerControls';

const DURATIONS = [5,10,20,30];
const MODES: Array<[AffirmationMode,string]> = [['morning','Morning'],['meditation','Meditation'],['walking','Walking'],['sleep','Sleep']];
const CADENCE: Array<[AffirmationCadence,string]> = [['occasional','Occasional'],['regular','Regular'],['affirmation-only','Affirmation Only']];

export function AffirmationScreen({ state, narrator, audioSettings, onStateChange, onNarratorChange, onAudioSettingsChange, onClose }: {
  state: AffirmationState;
  narrator: NarratorId;
  audioSettings: AudioSettings;
  onStateChange: (next: AffirmationState) => void | Promise<void>;
  onNarratorChange: (next: NarratorId) => void | Promise<void>;
  onAudioSettingsChange: (next: AudioSettings) => void | Promise<void>;
  onClose: () => void;
}) {
  const [sessionActive, setSessionActive] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [customText, setCustomText] = useState('');
  const selected = useMemo(() => {
    const allowed = new Set(state.categoryIds);
    const pool = AFFIRMATIONS.filter((item) => !allowed.size || allowed.has(item.categoryId));
    const favorites = new Set(state.favoriteIds);
    return [...pool].sort((a,b) => Number(favorites.has(b.id)) - Number(favorites.has(a.id)) || a.id.localeCompare(b.id));
  }, [state.categoryIds, state.favoriteIds]);

  const playback = useAffirmationPlayer({ items:selected, narrator, style:state.style, cadence:state.cadence, narrationVolume:audioSettings.narrationVolume });
  const mixer = useMeditationMixer({ settings:audioSettings, narrationActive:playback.isNarrating, started:sessionActive, running, reflecting:false, finished:false });
  const totalSeconds = state.minutes * 60;

  useEffect(() => {
    if (!sessionActive || !running) return;
    const timer = setInterval(() => setElapsed((value) => {
      const next = value + 1;
      if (next >= totalSeconds) {
        setRunning(false);
        setSessionActive(false);
        playback.stop();
        mixer.stop();
        return totalSeconds;
      }
      return next;
    }), 1000);
    return () => clearInterval(timer);
  }, [mixer.stop, playback.stop, running, sessionActive, totalSeconds]);

  const patch = (value: Partial<AffirmationState>) => onStateChange({ ...state, ...value });
  function toggleCategory(id: string) {
    const set = new Set(state.categoryIds);
    if (set.has(id)) set.delete(id); else set.add(id);
    patch({ categoryIds:[...set] });
  }
  function toggleFavorite(id: string) {
    const set = new Set(state.favoriteIds);
    if (set.has(id)) set.delete(id); else set.add(id);
    patch({ favoriteIds:[...set] });
  }
  function addCustom() {
    const text = customText.trim();
    if (!text) return;
    patch({ custom:[...state.custom, { id:`custom-${Date.now()}`, text, createdAt:Date.now() }] });
    setCustomText('');
  }
  function start() {
    setElapsed(0); setSessionActive(true); setRunning(true); playback.start();
  }
  function togglePlayback() {
    if (running) { setRunning(false); playback.pause(); }
    else { setSessionActive(true); setRunning(true); playback.resume(); }
  }
  function stop() { setRunning(false); setSessionActive(false); playback.stop(); mixer.stop(); }
  const remaining = Math.max(0,totalSeconds-elapsed);
  const time = `${Math.floor(remaining/60).toString().padStart(2,'0')}:${(remaining%60).toString().padStart(2,'0')}`;
  const currentText = playback.current ? (state.style === 'command' ? playback.current.command : playback.current.becoming) : '';

  return <SafeAreaView style={{ flex:1,backgroundColor:COLORS.bg }}><ScrollView contentContainerStyle={{ padding:20,paddingTop:24,paddingBottom:80 }} keyboardShouldPersistTaps="handled">
    <View style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center' }}><Pressable accessibilityRole="button" accessibilityLabel="Close Affirmation Studio" onPress={()=>{stop();onClose();}}><Text style={{ color:COLORS.muted,fontWeight:'900' }}>Close</Text></Pressable><Text style={{ color:COLORS.violet,fontWeight:'900' }}>V0.4</Text></View>
    <Text style={{ color:COLORS.cyan,fontSize:11,fontWeight:'900',letterSpacing:2,marginTop:24 }}>AFFIRMATION STUDIO</Text>
    <Text style={{ color:COLORS.text,fontSize:31,fontWeight:'900',marginTop:8 }}>Practice the identity you choose.</Text>
    <Text style={{ color:COLORS.muted,lineHeight:20,marginTop:7 }}>Command statements are direct. Becoming statements are gradual and often easier to believe. Natural neural voices are bundled; custom statements stay private and visual-only rather than using system TTS.</Text>

    {sessionActive && <View style={{ backgroundColor:'#151A30',borderRadius:20,padding:18,marginTop:18,borderWidth:1,borderColor:'#424873' }}>
      <Text accessibilityLabel="Affirmation playback state" style={{ color:COLORS.green,fontSize:12,fontWeight:'900' }}>AFFIRMATIONS · {playback.state.toUpperCase()} · SOUND {mixer.state.toUpperCase()}</Text>
      <Text style={{ color:COLORS.text,fontSize:34,fontWeight:'800',textAlign:'center',marginTop:12 }}>{time}</Text>
      <Text style={{ color:COLORS.text,fontSize:19,lineHeight:28,textAlign:'center',marginTop:16 }}>{currentText || 'Preparing your first affirmation…'}</Text>
      <View style={{ flexDirection:'row',gap:8,marginTop:18 }}><Pressable accessibilityRole="button" accessibilityLabel={running?'Pause affirmations':'Resume affirmations'} onPress={togglePlayback} style={{ flex:1,backgroundColor:'#F4F2FF',paddingVertical:13,borderRadius:14,alignItems:'center' }}><Text style={{ color:'#111427',fontWeight:'900' }}>{running?'Pause':'Resume'}</Text></Pressable><Pressable onPress={stop} style={{ flex:1,borderWidth:1,borderColor:COLORS.border,paddingVertical:13,borderRadius:14,alignItems:'center' }}><Text style={{ color:COLORS.text,fontWeight:'900' }}>Stop</Text></Pressable></View>
    </View>}

    <Text style={{ color:COLORS.text,fontSize:17,fontWeight:'900',marginTop:22 }}>Categories</Text>
    <View style={{ flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:10 }}>{AFFIRMATION_CATEGORIES.map((category)=><Pressable key={category.id} accessibilityRole="button" accessibilityLabel={`Affirmation category ${category.label}`} onPress={()=>toggleCategory(category.id)} style={{ paddingVertical:8,paddingHorizontal:10,borderRadius:12,borderWidth:1,borderColor:state.categoryIds.includes(category.id)?COLORS.cyan:COLORS.border,backgroundColor:state.categoryIds.includes(category.id)?'#17313D':COLORS.card }}><Text style={{ color:COLORS.text,fontSize:12,fontWeight:'800' }}>{category.label}</Text></Pressable>)}</View>

    <Text style={{ color:COLORS.text,fontSize:17,fontWeight:'900',marginTop:20 }}>Style</Text>
    <View style={{ flexDirection:'row',gap:8,marginTop:9 }}>{(['command','becoming'] as AffirmationStyle[]).map((style)=><Pressable key={style} accessibilityRole="button" accessibilityLabel={`Affirmation style ${style}`} onPress={()=>patch({style})} style={{ flex:1,paddingVertical:11,borderRadius:13,alignItems:'center',borderWidth:1,borderColor:state.style===style?COLORS.violet:COLORS.border,backgroundColor:state.style===style?'#30284B':COLORS.card }}><Text style={{ color:COLORS.text,fontWeight:'900' }}>{style==='command'?'Command':'Becoming'}</Text></Pressable>)}</View>

    <Text style={{ color:COLORS.text,fontSize:17,fontWeight:'900',marginTop:20 }}>Mode & cadence</Text>
    <View style={{ flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:9 }}>{MODES.map(([id,label])=><Pressable key={id} onPress={()=>patch({mode:id})} style={{ paddingVertical:8,paddingHorizontal:12,borderRadius:12,borderWidth:1,borderColor:state.mode===id?COLORS.cyan:COLORS.border }}><Text style={{ color:COLORS.text,fontSize:12,fontWeight:'800' }}>{label}</Text></Pressable>)}</View>
    <View style={{ flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:8 }}>{CADENCE.map(([id,label])=><Pressable key={id} onPress={()=>patch({cadence:id})} style={{ paddingVertical:8,paddingHorizontal:12,borderRadius:12,borderWidth:1,borderColor:state.cadence===id?COLORS.violet:COLORS.border }}><Text style={{ color:COLORS.text,fontSize:12,fontWeight:'800' }}>{label}</Text></Pressable>)}</View>
    <View style={{ flexDirection:'row',gap:7,marginTop:10 }}>{DURATIONS.map((minutes)=><Pressable key={minutes} onPress={()=>patch({minutes})} style={{ flex:1,paddingVertical:9,borderRadius:12,alignItems:'center',borderWidth:1,borderColor:state.minutes===minutes?COLORS.green:COLORS.border }}><Text style={{ color:COLORS.text,fontWeight:'800' }}>{minutes}m</Text></Pressable>)}</View>

    <Text style={{ color:COLORS.text,fontSize:17,fontWeight:'900',marginTop:20 }}>Voice</Text>
    <View style={{ flexDirection:'row',gap:8,marginTop:9 }}>{(['female','male'] as NarratorId[]).map((id)=><Pressable key={id} accessibilityRole="button" accessibilityLabel={`Affirmation narrator ${NARRATOR_LABELS[id]}`} onPress={()=>onNarratorChange(id)} style={{ flex:1,paddingVertical:11,borderRadius:13,alignItems:'center',borderWidth:1,borderColor:narrator===id?COLORS.violet:COLORS.border,backgroundColor:narrator===id?'#30284B':COLORS.card }}><Text style={{ color:COLORS.text,fontWeight:'900' }}>{NARRATOR_LABELS[id]}</Text></Pressable>)}</View>

    <AudioMixerControls settings={audioSettings} onChange={onAudioSettingsChange} compact/>

    <Text style={{ color:COLORS.text,fontSize:17,fontWeight:'900',marginTop:20 }}>Favorites</Text>
    <View style={{ gap:8,marginTop:9 }}>{selected.slice(0,10).map((item)=>{ const favorite=state.favoriteIds.includes(item.id); return <Pressable key={item.id} onPress={()=>toggleFavorite(item.id)} style={{ backgroundColor:COLORS.card,borderRadius:14,borderWidth:1,borderColor:favorite?COLORS.green:COLORS.border,padding:12 }}><Text style={{ color:COLORS.text,lineHeight:19 }}>{state.style==='command'?item.command:item.becoming}</Text><Text style={{ color:favorite?COLORS.green:'#737C99',fontSize:11,fontWeight:'900',marginTop:6 }}>{favorite?'★ FAVORITE':'☆ TAP TO FAVORITE'}</Text></Pressable>; })}</View>

    <Text style={{ color:COLORS.text,fontSize:17,fontWeight:'900',marginTop:20 }}>Your own affirmation</Text>
    <TextInput value={customText} onChangeText={setCustomText} placeholder="Write a private statement…" placeholderTextColor="#69718C" multiline style={{ minHeight:72,color:COLORS.text,backgroundColor:COLORS.card,borderWidth:1,borderColor:COLORS.border,borderRadius:14,padding:12,marginTop:9,textAlignVertical:'top' }}/>
    <Pressable onPress={addCustom} style={{ alignSelf:'flex-start',paddingVertical:9,paddingHorizontal:13,borderRadius:12,borderWidth:1,borderColor:COLORS.cyan,marginTop:8 }}><Text style={{ color:COLORS.cyan,fontWeight:'900' }}>Save private statement</Text></Pressable>
    {state.custom.map((item)=><View key={item.id} style={{ backgroundColor:COLORS.card,borderRadius:12,padding:11,marginTop:7 }}><Text style={{ color:COLORS.text }}>{item.text}</Text><Text style={{ color:'#737C99',fontSize:10,marginTop:4 }}>Visual-only · never sent to a speech service</Text></View>)}

    <Pressable accessibilityRole="button" accessibilityLabel="Start affirmation session" onPress={start} style={{ backgroundColor:'#F4F2FF',paddingVertical:16,borderRadius:17,alignItems:'center',marginTop:24 }}><Text style={{ color:'#111427',fontSize:16,fontWeight:'900' }}>Start {state.minutes}-Minute Affirmation Session</Text></Pressable>
    {playback.error||mixer.error?<Text style={{ color:'#FF9B9B',fontSize:11,marginTop:8 }}>{playback.error||mixer.error}</Text>:null}
  </ScrollView></SafeAreaView>;
}
