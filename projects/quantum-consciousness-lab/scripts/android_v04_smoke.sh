#!/usr/bin/env bash
set -euo pipefail

APK=projects/quantum-consciousness-lab/ConsciousnessLab-v0.4.0-universal-standalone.apk
APP_ID=com.merg357.consciousnesslab
ROOT=projects/quantum-consciousness-lab

stage() { echo "ANDROID_V04_STAGE $*"; }

capture_evidence() {
  set +e
  adb exec-out screencap -p > "$ROOT/android-v04-smoke.png" 2>/dev/null
  adb logcat -d > "$ROOT/android-v04-logcat.txt" 2>/dev/null
  adb shell dumpsys audio > "$ROOT/android-v04-audio.txt" 2>/dev/null
  set -e
}
trap capture_evidence EXIT

pull_ui() {
  local remote="$1" local_file="$2"
  adb shell uiautomator dump "$remote" >/dev/null 2>&1
  adb pull "$remote" "$local_file" >/dev/null 2>&1
}

coords_for_label() {
  local xml="$1" label="$2"
  XML="$xml" LABEL="$label" python3 - <<'PY'
import os,re
from html import unescape
s=open(os.environ['XML'],encoding='utf-8').read(); label=os.environ['LABEL']
for node in re.findall(r'<node\b[^>]*>',s):
    vals=[]
    for attr in ('text','content-desc'):
        m=re.search(attr+r'="([^"]*)"',node)
        if m: vals.append(unescape(m.group(1)))
    if label not in vals: continue
    b=re.search(r'bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"',node)
    if b:
        a,c,d,e=map(int,b.groups()); print((a+d)//2,(c+e)//2); raise SystemExit(0)
raise SystemExit(1)
PY
}

tap_label() {
  local xml="$1" label="$2" coords x y
  coords=$(coords_for_label "$xml" "$label")
  read -r x y <<<"$coords"
  adb shell input tap "$x" "$y"
}

scroll_top() {
  for _ in $(seq 1 10); do adb shell input swipe 540 650 540 1800 250; done
  sleep 1
}

tap_label_scroll() {
  local label="$1" out="$2"
  for _ in $(seq 1 12); do
    pull_ui /sdcard/current.xml "$out"
    if coords=$(coords_for_label "$out" "$label" 2>/dev/null); then
      read -r x y <<<"$coords"
      adb shell input tap "$x" "$y"
      return 0
    fi
    adb shell input swipe 540 1800 540 650 350
    sleep 1
  done
  echo "label not found after scrolling: $label" >&2
  return 1
}

started_audio_count() {
  local pid="$1" file="$2"
  adb shell dumpsys audio > "$file"
  grep -Ec "AudioPlaybackConfiguration .*u/pid:[0-9]+/${pid} state:started" "$file" || true
}

stage install
adb install -r "$APK"
adb shell pm clear "$APP_ID" >/dev/null
adb logcat -c
adb shell monkey -p "$APP_ID" -c android.intent.category.LAUNCHER 1 >/dev/null
sleep 9

stage onboarding
pull_ui /sdcard/onboarding.xml "$ROOT/android-v04-onboarding.xml"
grep -q 'Enter the Lab' "$ROOT/android-v04-onboarding.xml"
tap_label "$ROOT/android-v04-onboarding.xml" 'Enter the Lab'
sleep 4

stage home
pull_ui /sdcard/home.xml "$ROOT/android-v04-home.xml"
grep -q 'How do you want to feel?' "$ROOT/android-v04-home.xml"
for tab in Home Practice Explore Lab Journal; do grep -q "$tab" "$ROOT/android-v04-home.xml"; done
tap_label "$ROOT/android-v04-home.xml" 'Practice'
sleep 3

stage v04-tools
pull_ui /sdcard/practice.xml "$ROOT/android-v04-practice.xml"
grep -q 'Soundscapes &amp; Frequencies\|Soundscapes & Frequencies' "$ROOT/android-v04-practice.xml"
grep -q 'Affirmation Studio' "$ROOT/android-v04-practice.xml"
grep -q '32-Day Rewire' "$ROOT/android-v04-practice.xml"

tap_label_scroll 'Open Soundscapes & Frequencies' "$ROOT/android-v04-practice-scroll.xml"
sleep 2
pull_ui /sdcard/sounds.xml "$ROOT/android-v04-sounds.xml"
grep -q 'SOUND LIBRARY' "$ROOT/android-v04-sounds.xml"
grep -q 'Alpha 10 Hz' "$ROOT/android-v04-sounds.xml"
tap_label "$ROOT/android-v04-sounds.xml" 'Close Sound Library'
sleep 2

tap_label_scroll 'Open Affirmation Studio' "$ROOT/android-v04-practice-scroll.xml"
sleep 2
pull_ui /sdcard/affirmations.xml "$ROOT/android-v04-affirmations.xml"
grep -q 'AFFIRMATION STUDIO' "$ROOT/android-v04-affirmations.xml"
grep -q 'Becoming' "$ROOT/android-v04-affirmations.xml"
tap_label_scroll 'Start affirmation session' "$ROOT/android-v04-affirmation-scroll.xml"
sleep 5
APP_PID=$(adb shell pidof "$APP_ID" | tr -d '\r' | awk '{print $1}')
test -n "$APP_PID"
AFF_AUDIO=$(started_audio_count "$APP_PID" "$ROOT/android-v04-affirmation-audio.txt")
echo "ANDROID_V04_AFFIRMATION_AUDIO_COUNT=$AFF_AUDIO"
test "$AFF_AUDIO" -ge 2
pull_ui /sdcard/affirmation-playing.xml "$ROOT/android-v04-affirmation-playing.xml"
grep -q 'AFFIRMATIONS' "$ROOT/android-v04-affirmation-playing.xml"
scroll_top
pull_ui /sdcard/affirmation-top.xml "$ROOT/android-v04-affirmation-top.xml"
tap_label "$ROOT/android-v04-affirmation-top.xml" 'Close Affirmation Studio'
sleep 2

tap_label_scroll 'Open 32-Day Rewire' "$ROOT/android-v04-practice-scroll.xml"
sleep 2
pull_ui /sdcard/challenge.xml "$ROOT/android-v04-challenge.xml"
grep -q '32-Day Rewire' "$ROOT/android-v04-challenge.xml"
grep -q 'Day 1 of 32' "$ROOT/android-v04-challenge.xml"
tap_label "$ROOT/android-v04-challenge.xml" 'Close 32-Day Rewire'
sleep 2

stage layered-meditation
tap_label_scroll 'Start Deep Rest' "$ROOT/android-v04-practice-scroll.xml"
sleep 3
pull_ui /sdcard/session-before.xml "$ROOT/android-v04-session-before.xml"
grep -q 'Warm Female' "$ROOT/android-v04-session-before.xml"
grep -q 'Deep Male' "$ROOT/android-v04-session-before.xml"
grep -q 'Android system TTS is not used' "$ROOT/android-v04-session-before.xml"
tap_label_scroll 'Narrator Deep Male' "$ROOT/android-v04-session-scroll.xml"
sleep 2
tap_label_scroll 'Frequency Alpha 10 Hz' "$ROOT/android-v04-session-scroll.xml"
sleep 1
tap_label_scroll 'Start Deep Rest' "$ROOT/android-v04-session-scroll.xml"
sleep 6

APP_PID=$(adb shell pidof "$APP_ID" | tr -d '\r' | awk '{print $1}')
test -n "$APP_PID"
MIX_AUDIO=$(started_audio_count "$APP_PID" "$ROOT/android-v04-mixer-audio.txt")
echo "ANDROID_V04_LAYERED_AUDIO_COUNT=$MIX_AUDIO"
test "$MIX_AUDIO" -ge 3
pull_ui /sdcard/meditation-playing.xml "$ROOT/android-v04-meditation-playing.xml"
grep -q 'Natural narration' "$ROOT/android-v04-meditation-playing.xml"
grep -q 'Meditation sound' "$ROOT/android-v04-meditation-playing.xml"
grep -q 'Cosmic Ambient' "$ROOT/android-v04-meditation-playing.xml"
grep -q 'Alpha 10 Hz' "$ROOT/android-v04-meditation-playing.xml"

stage final-safety
adb logcat -d > "$ROOT/android-v04-logcat.txt"
! grep -qi 'Unable to load script' "$ROOT"/android-v04-*.xml "$ROOT/android-v04-logcat.txt"
! grep -q 'FATAL EXCEPTION' "$ROOT/android-v04-logcat.txt"
adb shell pidof "$APP_ID" >/dev/null
adb shell dumpsys package "$APP_ID" | grep -q 'versionName=0.4.0'
adb exec-out screencap -p > "$ROOT/android-v04-smoke.png"

trap - EXIT
stage complete
echo 'ANDROID_V04_SMOKE_OK'
