import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { COLORS } from '../theme';
import type { AudioSettings } from '../types';
import { SOUND_TRACKS } from '../audio/soundManifest';
import { downloadTrack, downloadedBytes, getDownloadedTrackIds, removeTrack } from '../audio/packManager';

function formatBytes(value: number) {
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export function SoundLibraryScreen({ audioSettings, onAudioSettingsChange, onClose }: {
  audioSettings: AudioSettings;
  onAudioSettingsChange: (next: AudioSettings) => void | Promise<void>;
  onClose: () => void;
}) {
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const downloaded = useMemo(() => new Set(getDownloadedTrackIds()), [revision]);
  const extended = SOUND_TRACKS.filter((track) => !track.bundled);
  const bundled = SOUND_TRACKS.filter((track) => track.bundled);

  async function toggleDownload(id: string) {
    setBusy(id); setError(null);
    try {
      if (downloaded.has(id)) removeTrack(id); else await downloadTrack(id);
      setRevision((value) => value + 1);
    } catch (cause) { setError(String(cause)); }
    finally { setBusy(null); }
  }

  function useTrack(id: string, kind: string) {
    if (kind === 'frequency') onAudioSettingsChange({ ...audioSettings, frequencyTrackId:id });
    else onAudioSettingsChange({ ...audioSettings, backgroundTrackId:id });
  }

  return <SafeAreaView style={{ flex:1,backgroundColor:COLORS.bg }}><ScrollView contentContainerStyle={{ padding:20,paddingTop:24,paddingBottom:80 }}>
    <View style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center' }}><Pressable accessibilityRole="button" accessibilityLabel="Close Sound Library" onPress={onClose}><Text style={{ color:COLORS.muted,fontWeight:'900' }}>Close</Text></Pressable><Text style={{ color:COLORS.cyan,fontWeight:'900' }}>{formatBytes(downloadedBytes())} downloaded</Text></View>
    <Text style={{ color:COLORS.cyan,fontSize:11,fontWeight:'900',letterSpacing:2,marginTop:24 }}>SOUND LIBRARY</Text>
    <Text style={{ color:COLORS.text,fontSize:31,fontWeight:'900',marginTop:8 }}>Build your meditation atmosphere.</Text>
    <Text style={{ color:COLORS.muted,lineHeight:20,marginTop:7 }}>Starter music, nature and frequency layers work offline. Optional packs can be downloaded and removed. All music and environmental sound beds are original Consciousness Lab assets.</Text>

    <View style={{ backgroundColor:'#171B2F',borderRadius:16,padding:13,marginTop:16,borderWidth:1,borderColor:COLORS.border }}><Text style={{ color:COLORS.text,fontWeight:'900' }}>Evidence labels matter</Text><Text style={{ color:COLORS.muted,fontSize:12,lineHeight:18,marginTop:5 }}>Nature/music are offered for relaxation. Binaural beats are emerging evidence and work as intended only with stereo headphones. 432/528 Hz and Solfeggio tunings are experimental options, not claims of DNA repair, disease treatment, or guaranteed manifestation.</Text></View>

    <Text style={{ color:COLORS.text,fontSize:18,fontWeight:'900',marginTop:22 }}>Offline starter pack</Text>
    <View style={{ gap:8,marginTop:10 }}>{bundled.map((track)=>{
      const selected = track.kind==='frequency'?audioSettings.frequencyTrackId===track.id:audioSettings.backgroundTrackId===track.id;
      return <View key={track.id} style={{ backgroundColor:COLORS.card,borderRadius:15,padding:13,borderWidth:1,borderColor:selected?COLORS.green:COLORS.border }}><View style={{ flexDirection:'row',gap:10,alignItems:'center' }}><View style={{ flex:1 }}><Text style={{ color:COLORS.text,fontWeight:'900' }}>{track.label}</Text><Text style={{ color:track.evidence==='Experimental'?COLORS.rose:track.evidence==='Emerging'?COLORS.violet:COLORS.cyan,fontSize:11,fontWeight:'900',marginTop:3 }}>{track.kind.toUpperCase()} · {track.evidence.toUpperCase()}{track.binaural?' · HEADPHONES':''}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={`Use sound ${track.label}`} onPress={()=>useTrack(track.id,track.kind)} style={{ paddingVertical:8,paddingHorizontal:12,borderRadius:11,backgroundColor:selected?'#1D3A30':'#252B44' }}><Text style={{ color:selected?COLORS.green:COLORS.text,fontWeight:'900',fontSize:12 }}>{selected?'Using':'Use'}</Text></Pressable></View></View>;
    })}</View>

    <Text style={{ color:COLORS.text,fontSize:18,fontWeight:'900',marginTop:24 }}>Optional downloadable packs</Text>
    <View style={{ gap:8,marginTop:10 }}>{extended.map((track)=>{
      const have=downloaded.has(track.id); const selected=track.kind==='frequency'?audioSettings.frequencyTrackId===track.id:audioSettings.backgroundTrackId===track.id;
      return <View key={track.id} style={{ backgroundColor:COLORS.card,borderRadius:15,padding:13,borderWidth:1,borderColor:selected?COLORS.green:COLORS.border }}><Text style={{ color:COLORS.text,fontWeight:'900' }}>{track.label}</Text><Text style={{ color:track.evidence==='Experimental'?COLORS.rose:COLORS.cyan,fontSize:11,fontWeight:'900',marginTop:3 }}>{track.kind.toUpperCase()} · {track.evidence.toUpperCase()}</Text><View style={{ flexDirection:'row',gap:8,marginTop:10 }}><Pressable accessibilityRole="button" accessibilityLabel={`${have?'Remove':'Download'} sound ${track.label}`} disabled={busy===track.id} onPress={()=>toggleDownload(track.id)} style={{ flex:1,paddingVertical:9,borderRadius:11,alignItems:'center',borderWidth:1,borderColor:COLORS.border }}><Text style={{ color:COLORS.text,fontWeight:'900',fontSize:12 }}>{busy===track.id?'Working…':have?'Remove':'Download'}</Text></Pressable>{have&&<Pressable accessibilityRole="button" accessibilityLabel={`Use downloaded sound ${track.label}`} onPress={()=>useTrack(track.id,track.kind)} style={{ flex:1,paddingVertical:9,borderRadius:11,alignItems:'center',backgroundColor:selected?'#1D3A30':'#2A3150' }}><Text style={{ color:selected?COLORS.green:COLORS.text,fontWeight:'900',fontSize:12 }}>{selected?'Using':'Use'}</Text></Pressable>}</View></View>;
    })}</View>
    {error?<Text style={{ color:'#FF9B9B',fontSize:12,lineHeight:18,marginTop:12 }}>{error}</Text>:null}
  </ScrollView></SafeAreaView>;
}
