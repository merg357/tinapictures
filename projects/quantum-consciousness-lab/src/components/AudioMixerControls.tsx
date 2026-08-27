import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { COLORS } from '../theme';
import type { AudioSettings } from '../types';
import { SOUND_TRACKS } from '../audio/soundManifest';

function pct(value: number) { return `${Math.round(value * 100)}%`; }
function clamp(value: number) { return Math.max(0, Math.min(1, Math.round(value * 10) / 10)); }
const NARRATION_SPEEDS = [0.65, 0.75, 0.85, 1, 1.15] as const;

function VolumeRow({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 }}>
    <Text style={{ color: COLORS.muted, fontSize: 12, flex: 1 }}>{label}</Text>
    <Pressable accessibilityRole="button" accessibilityLabel={`Lower ${label}`} onPress={() => onChange(clamp(value - 0.1))} style={{ width: 34, height: 30, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: COLORS.text, fontWeight: '900' }}>−</Text></Pressable>
    <Text style={{ color: COLORS.text, minWidth: 42, textAlign: 'center', fontSize: 12, fontWeight: '800' }}>{pct(value)}</Text>
    <Pressable accessibilityRole="button" accessibilityLabel={`Raise ${label}`} onPress={() => onChange(clamp(value + 0.1))} style={{ width: 34, height: 30, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: COLORS.text, fontWeight: '900' }}>+</Text></Pressable>
  </View>;
}

export function AudioMixerControls({ settings, onChange, compact = false }: { settings: AudioSettings; onChange: (next: AudioSettings) => void; compact?: boolean }) {
  const backgroundTracks = SOUND_TRACKS.filter((track) => track.bundled && (track.kind === 'music' || track.kind === 'nature'));
  const frequencyTracks = SOUND_TRACKS.filter((track) => track.bundled && track.kind === 'frequency');
  const patch = (value: Partial<AudioSettings>) => onChange({ ...settings, ...value });

  return <View style={{ backgroundColor: COLORS.card, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginTop: compact ? 10 : 16 }}>
    <Text style={{ color: COLORS.cyan, fontSize: 11, fontWeight: '900', letterSpacing: 1.3 }}>MEDITATION SOUND</Text>
    <Text style={{ color: COLORS.text, fontWeight: '900', marginTop: 12 }}>Background</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 8 }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Background Off" onPress={() => patch({ backgroundTrackId: 'off' })} style={{ paddingVertical: 8, paddingHorizontal: 11, borderRadius: 12, backgroundColor: settings.backgroundTrackId === 'off' ? '#2B3150' : COLORS.bg, borderWidth: 1, borderColor: settings.backgroundTrackId === 'off' ? COLORS.cyan : COLORS.border }}><Text style={{ color: COLORS.text, fontSize: 12, fontWeight: '800' }}>Off</Text></Pressable>
      {backgroundTracks.map((track) => <Pressable key={track.id} accessibilityRole="button" accessibilityLabel={`Background ${track.label}`} onPress={() => patch({ backgroundTrackId: track.id })} style={{ paddingVertical: 8, paddingHorizontal: 11, borderRadius: 12, backgroundColor: settings.backgroundTrackId === track.id ? '#2B3150' : COLORS.bg, borderWidth: 1, borderColor: settings.backgroundTrackId === track.id ? COLORS.cyan : COLORS.border }}><Text style={{ color: COLORS.text, fontSize: 12, fontWeight: '800' }}>{track.label}</Text></Pressable>)}
    </View>

    <Text style={{ color: COLORS.text, fontWeight: '900', marginTop: 14 }}>Frequency / Tone</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 8 }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Frequency Off" onPress={() => patch({ frequencyTrackId: 'off' })} style={{ paddingVertical: 8, paddingHorizontal: 11, borderRadius: 12, backgroundColor: settings.frequencyTrackId === 'off' ? '#30284B' : COLORS.bg, borderWidth: 1, borderColor: settings.frequencyTrackId === 'off' ? COLORS.violet : COLORS.border }}><Text style={{ color: COLORS.text, fontSize: 12, fontWeight: '800' }}>Off</Text></Pressable>
      {frequencyTracks.map((track) => <Pressable key={track.id} accessibilityRole="button" accessibilityLabel={`Frequency ${track.label}`} onPress={() => patch({ frequencyTrackId: track.id })} style={{ paddingVertical: 8, paddingHorizontal: 11, borderRadius: 12, backgroundColor: settings.frequencyTrackId === track.id ? '#30284B' : COLORS.bg, borderWidth: 1, borderColor: settings.frequencyTrackId === track.id ? COLORS.violet : COLORS.border }}><Text style={{ color: COLORS.text, fontSize: 12, fontWeight: '800' }}>{track.label}</Text></Pressable>)}
    </View>
    <Text style={{ color: '#7D86A5', fontSize: 11, lineHeight: 16, marginTop: 8 }}>Binaural Alpha, Theta, Delta and Gamma options are experimental/early-evidence tools; headphones are recommended for the intended left/right beat. 432 Hz and 528 Hz are offered as experimental tunings, not medical treatment.</Text>

    <Text style={{ color: COLORS.text, fontWeight: '900', marginTop: 14 }}>Narrator speed</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 8 }}>
      {NARRATION_SPEEDS.map((speed) => <Pressable key={speed} accessibilityRole="button" accessibilityLabel={`Narrator speed ${speed} times`} onPress={() => patch({ narrationSpeed: speed })} style={{ paddingVertical: 8, paddingHorizontal: 11, borderRadius: 12, backgroundColor: Math.abs(settings.narrationSpeed - speed) < 0.001 ? '#2B3150' : COLORS.bg, borderWidth: 1, borderColor: Math.abs(settings.narrationSpeed - speed) < 0.001 ? COLORS.cyan : COLORS.border }}><Text style={{ color: COLORS.text, fontSize: 12, fontWeight: '800' }}>{speed.toFixed(2).replace(/0$/, '')}x</Text></Pressable>)}
    </View>
    <Text style={{ color: '#7D86A5', fontSize: 11, lineHeight: 16, marginTop: 8 }}>Slow the narrator without slowing the selected background music or frequency layer. Pitch correction stays enabled.</Text>

    <VolumeRow label="Voice" value={settings.narrationVolume} onChange={(narrationVolume) => patch({ narrationVolume })} />
    <VolumeRow label="Background" value={settings.backgroundVolume} onChange={(backgroundVolume) => patch({ backgroundVolume })} />
    <VolumeRow label="Frequency" value={settings.frequencyVolume} onChange={(frequencyVolume) => patch({ frequencyVolume })} />

    <Pressable accessibilityRole="button" accessibilityLabel="Six breaths per minute pulse" onPress={() => patch({ breathPulseEnabled: !settings.breathPulseEnabled })} style={{ marginTop: 12, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: settings.breathPulseEnabled ? COLORS.green : COLORS.border, backgroundColor: settings.breathPulseEnabled ? '#18352E' : COLORS.bg }}><Text style={{ color: COLORS.text, fontSize: 12, fontWeight: '900' }}>6 breaths/min pulse · {settings.breathPulseEnabled ? 'On' : 'Off'}</Text></Pressable>
  </View>;
}
