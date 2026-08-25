import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { COLORS } from '../theme';
import type { ChallengeProgress, SessionPlan, UserLens } from '../types';
import { CHALLENGE_DAYS, completeChallengeDay, getChallengeSummary, saveMilestoneNote } from '../data/challenge';
import { composeSession } from '../core/sessionComposer';

export function ChallengeScreen({ lens, progress, onProgressChange, onBegin, onOpenAffirmations, onClose }: {
  lens: UserLens;
  progress: ChallengeProgress;
  onProgressChange: (next: ChallengeProgress) => void | Promise<void>;
  onBegin: (plan: SessionPlan) => void;
  onOpenAffirmations: () => void;
  onClose: () => void;
}) {
  const summary = useMemo(() => getChallengeSummary(progress), [progress]);
  const [expanded, setExpanded] = useState(summary.currentDay);
  const [note, setNote] = useState(progress.milestoneNotes[String(summary.lastMilestone || 8)] ?? '');

  function complete(day: number) {
    const next = completeChallengeDay(progress, day, Date.now());
    onProgressChange(next);
    if (day < 32) setExpanded(day + 1);
  }

  function beginPractice(day: typeof CHALLENGE_DAYS[number]) {
    const plan = composeSession({ intent:`${day.practiceId} ${day.title}`, goal:day.title, minutes:10, lens }) as SessionPlan;
    onBegin(plan);
  }

  function saveNote(day: number) {
    onProgressChange(saveMilestoneNote(progress, day, note, Date.now()));
  }

  return <SafeAreaView style={{ flex:1,backgroundColor:COLORS.bg }}><ScrollView contentContainerStyle={{ padding:20,paddingTop:24,paddingBottom:80 }}>
    <View style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center' }}><Pressable accessibilityRole="button" accessibilityLabel="Close 32-Day Rewire" onPress={onClose}><Text style={{ color:COLORS.muted,fontWeight:'900' }}>Close</Text></Pressable><Text style={{ color:COLORS.green,fontWeight:'900' }}>{summary.percent}%</Text></View>
    <Text style={{ color:COLORS.cyan,fontSize:11,fontWeight:'900',letterSpacing:2,marginTop:24 }}>CONSCIOUSNESS LAB</Text>
    <Text accessibilityLabel="32-Day Rewire Challenge" style={{ color:COLORS.text,fontSize:31,fontWeight:'900',marginTop:8 }}>32-Day Rewire</Text>
    <Text style={{ color:COLORS.muted,lineHeight:20,marginTop:7 }}>An original Consciousness Lab progression inspired by behavior-change, meditation, mental rehearsal, gratitude, and self-observation themes. It is not an official Dr. Joe Dispenza program.</Text>

    <View style={{ backgroundColor:COLORS.card,borderRadius:20,padding:16,borderWidth:1,borderColor:COLORS.border,marginTop:18 }}>
      <View style={{ flexDirection:'row',justifyContent:'space-between' }}><Text style={{ color:COLORS.text,fontWeight:'900' }}>Day {summary.currentDay} of 32</Text><Text style={{ color:COLORS.cyan,fontWeight:'900' }}>{summary.completedCount}/32 complete</Text></View>
      <View style={{ height:7,borderRadius:999,backgroundColor:'#22273A',overflow:'hidden',marginTop:12 }}><View style={{ width:`${summary.percent}%`,height:'100%',backgroundColor:COLORS.green }}/></View>
      <Text style={{ color:COLORS.muted,fontSize:12,marginTop:10 }}>Contiguous progress: {summary.streak} day{summary.streak===1?'':'s'} · milestones at Days 8, 16, 24, 32</Text>
    </View>

    {[1,2,3,4].map((phase) => <View key={phase} style={{ marginTop:22 }}>
      <Text style={{ color:phase===1?COLORS.cyan:phase===2?COLORS.violet:phase===3?COLORS.green:COLORS.rose,fontSize:12,fontWeight:'900',letterSpacing:1.2 }}>PHASE {phase} · {CHALLENGE_DAYS.find((d)=>d.phase===phase)?.phaseTitle.toUpperCase()}</Text>
      <View style={{ gap:8,marginTop:9 }}>{CHALLENGE_DAYS.filter((d)=>d.phase===phase).map((day)=>{
        const done=progress.completedDays.includes(day.day); const open=expanded===day.day;
        return <View key={day.day} style={{ backgroundColor:COLORS.card,borderRadius:16,borderWidth:1,borderColor:done?COLORS.green:open?COLORS.cyan:COLORS.border,overflow:'hidden' }}>
          <Pressable accessibilityRole="button" accessibilityLabel={`Challenge Day ${day.day} ${day.title}`} onPress={()=>setExpanded(open?0:day.day)} style={{ padding:14,flexDirection:'row',gap:10,alignItems:'center' }}>
            <View style={{ width:34,height:34,borderRadius:17,alignItems:'center',justifyContent:'center',backgroundColor:done?'#19382D':'#242A41' }}><Text style={{ color:done?COLORS.green:COLORS.text,fontWeight:'900' }}>{done?'✓':day.day}</Text></View>
            <View style={{ flex:1 }}><Text style={{ color:COLORS.text,fontWeight:'900' }}>{day.title}</Text><Text style={{ color:COLORS.muted,fontSize:11,marginTop:3 }}>{day.milestone?'Milestone day · ':''}{done?'Completed':'Morning · Midday · Evening'}</Text></View>
          </Pressable>
          {open && <View style={{ padding:14,paddingTop:0 }}>
            <View style={{ borderTopWidth:1,borderTopColor:COLORS.border,paddingTop:12 }}><Text style={{ color:COLORS.cyan,fontSize:11,fontWeight:'900' }}>MORNING</Text><Text style={{ color:COLORS.text,lineHeight:19,marginTop:4 }}>{day.morning}</Text></View>
            <Text style={{ color:COLORS.violet,fontSize:11,fontWeight:'900',marginTop:13 }}>MIDDAY RESET · 30–90 SEC</Text><Text style={{ color:COLORS.text,lineHeight:19,marginTop:4 }}>{day.midday}</Text>
            <Text style={{ color:COLORS.green,fontSize:11,fontWeight:'900',marginTop:13 }}>EVENING</Text><Text style={{ color:COLORS.text,lineHeight:19,marginTop:4 }}>{day.evening}</Text>
            <View style={{ flexDirection:'row',gap:8,marginTop:14 }}><Pressable accessibilityRole="button" accessibilityLabel={`Start Day ${day.day} meditation`} onPress={()=>beginPractice(day)} style={{ flex:1,paddingVertical:11,borderRadius:12,alignItems:'center',backgroundColor:'#2A3150' }}><Text style={{ color:COLORS.text,fontWeight:'900',fontSize:12 }}>10m Meditation</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel={`Open Day ${day.day} affirmations`} onPress={onOpenAffirmations} style={{ flex:1,paddingVertical:11,borderRadius:12,alignItems:'center',backgroundColor:'#30284B' }}><Text style={{ color:COLORS.text,fontWeight:'900',fontSize:12 }}>Affirmations</Text></Pressable></View>
            {day.milestone && <View style={{ marginTop:14 }}><Text style={{ color:COLORS.text,fontWeight:'900' }}>What changed?</Text><TextInput value={note} onChangeText={setNote} placeholder="What changed in your reactions, choices, body, or attention?" placeholderTextColor="#69718C" multiline style={{ minHeight:70,color:COLORS.text,backgroundColor:COLORS.bg,borderWidth:1,borderColor:COLORS.border,borderRadius:12,padding:10,marginTop:7,textAlignVertical:'top' }}/><Pressable onPress={()=>saveNote(day.day)} style={{ alignSelf:'flex-start',marginTop:7 }}><Text style={{ color:COLORS.cyan,fontWeight:'900' }}>Save milestone reflection</Text></Pressable></View>}
            <Pressable accessibilityRole="button" accessibilityLabel={`Complete Challenge Day ${day.day}`} onPress={()=>complete(day.day)} style={{ backgroundColor:done?'#1D3A30':'#F4F2FF',paddingVertical:12,borderRadius:13,alignItems:'center',marginTop:14 }}><Text style={{ color:done?COLORS.green:'#111427',fontWeight:'900' }}>{done?'Completed · Tap to keep':'Complete Day '+day.day}</Text></Pressable>
          </View>}
        </View>;
      })}</View>
    </View>)}
  </ScrollView></SafeAreaView>;
}
