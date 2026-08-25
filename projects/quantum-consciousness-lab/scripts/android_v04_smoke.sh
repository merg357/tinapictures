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
  adb shell dumpsys media_session > "$ROOT/android-v04-media-session.txt" 2>/dev/null
  set -e
}
trap capture_evidence EXIT

pull_ui() {
  local remote="$1" local_file="$2"
  adb shell uiautomator dump "$remote" >/dev/null 2>&1
  adb pull "$remote" "$local_file" >/dev/null 2>&1
}

tap_label() {
  local xml="$1" label="$2" coords x y
  coords=$(XML="$xml" LABEL="$label" python3 - <<'PY'
import os,re
from html import unescape
s=open(os.environ['XML'],encoding='utf-8').read(); label=os.environ['LABEL']
for node in re.findall(r'<node\b[^>]*>',s):
    values=[]
    for attr in ('text','content-desc'):
        m=re.search(attr+r'="([^"]*)"',node)
        if m: values.append(unescape(m.group(1)))
    if label not in values: continue
    b=re.search(r'bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"',node)
    if b:
        a,c,d,e=map(int,b.groups()); print((a+d)//2,(c+e)//2); raise SystemExit(0)
raise SystemExit(f'label not found: {label}')
PY
)
  read -r x y <<<"$coords"
  adb shell input tap "$x" "$y"
}

scroll_down() { adb shell input swipe 540 1700 540 520 300; sleep 1; }
scroll_top() { for _ in 1 2 3 4 5 6; do adb shell input swipe 540 550 540 1750 180; done; sleep 1; }

stage install
adb install -r "$APK"
adb shell pm clear "$APP_ID" >/dev/null
adb logcat -c
adb shell monkey -p "$APP_ID" -c android.intent.category.LAUNCHER 1 >/dev/null
sleep 8

stage onboarding
pull_ui /sdcard/v04-onboarding.xml "$ROOT/android-v04-onboarding.xml"
grep -q 'Enter the Lab' "$ROOT/android-v04-onboarding.xml"
tap_label "$ROOT/android-v04-onboarding.xml" 'Enter the Lab'
sleep 3

stage home-and-practice
pull_ui /sdcard/v04-home.xml "$ROOT/android-v04-home.xml"
grep -q 'How do you want to feel?' "$ROOT/android-v04-home.xml"
for tab in Home Practice Explore Lab Journal; do grep -q "$tab" "$ROOT/android-v04-home.xml"; done
tap_label "$ROOT/android-v04-home.xml" 'Practice'
sleep 2
pull_ui /sdcard/v04-practice.xml "$ROOT/android-v04-practice.xml"
grep -q 'V0.4 tools' "$ROOT/android-v04-practice.xml"
grep -q 'Sound Library' "$ROOT/android-v04-practice.xml"
grep -q 'Affirmation Studio' "$ROOT/android-v04-practice.xml"
grep -q '32-Day Rewire' "$ROOT/android-v04-practice.xml"

stage sound-library
tap_label "$ROOT/android-v04-practice.xml" 'Open Sound Library'
sleep 2
pull_ui /sdcard/v04-sounds.xml "$ROOT/android-v04-sounds.xml"
grep -q 'Build your meditation atmosphere' "$ROOT/android-v04-sounds.xml"
grep -q 'Ocean' "$ROOT/android-v04-sounds.xml"
grep -q 'Theta 6 Hz' "$ROOT/android-v04-sounds.xml"
tap_label "$ROOT/android-v04-sounds.xml" 'Use sound Ocean'
sleep 1
tap_label "$ROOT/android-v04-sounds.xml" 'Close Sound Library'
sleep 2

stage affirmation-studio
pull_ui /sdcard/v04-practice-after-sounds.xml "$ROOT/android-v04-practice-after-sounds.xml"
tap_label "$ROOT/android-v04-practice-after-sounds.xml" 'Open Affirmation Studio'
sleep 2
pull_ui /sdcard/v04-affirmations.xml "$ROOT/android-v04-affirmations.xml"
grep -q 'Practice the identity you choose' "$ROOT/android-v04-affirmations.xml"
grep -q 'Command' "$ROOT/android-v04-affirmations.xml"
grep -q 'Becoming' "$ROOT/android-v04-affirmations.xml"
tap_label "$ROOT/android-v04-affirmations.xml" 'Affirmation narrator Deep Male'
# Start control is lower on the scrollable screen.
for _ in 1 2 3 4 5; do scroll_down; done
pull_ui /sdcard/v04-affirmations-bottom.xml "$ROOT/android-v04-affirmations-bottom.xml"
tap_label "$ROOT/android-v04-affirmations-bottom.xml" 'Start affirmation session'
sleep 4
pull_ui /sdcard/v04-affirmations-playing.xml "$ROOT/android-v04-affirmations-playing.xml"
grep -Eq 'AFFIRMATIONS .* (PLAYING|WAITING)' "$ROOT/android-v04-affirmations-playing.xml"
APP_PID=$(adb shell pidof "$APP_ID" | tr -d '\r' | awk '{print $1}')
test -n "$APP_PID"
adb shell dumpsys audio > "$ROOT/android-v04-affirmation-audio.txt"
grep -Eq "AudioPlaybackConfiguration .*u/pid:[0-9]+/${APP_PID} state:started" "$ROOT/android-v04-affirmation-audio.txt"
# Close from the top after stopping.
pull_ui /sdcard/v04-affirmations-playing.xml "$ROOT/android-v04-affirmations-playing.xml"
if grep -q 'Stop' "$ROOT/android-v04-affirmations-playing.xml"; then tap_label "$ROOT/android-v04-affirmations-playing.xml" 'Stop'; fi
scroll_top
pull_ui /sdcard/v04-affirmations-top.xml "$ROOT/android-v04-affirmations-top.xml"
tap_label "$ROOT/android-v04-affirmations-top.xml" 'Close Affirmation Studio'
sleep 2

stage challenge
pull_ui /sdcard/v04-practice-after-affirmations.xml "$ROOT/android-v04-practice-after-affirmations.xml"
tap_label "$ROOT/android-v04-practice-after-affirmations.xml" 'Open 32-Day Rewire'
sleep 2
pull_ui /sdcard/v04-challenge.xml "$ROOT/android-v04-challenge.xml"
grep -q '32-Day Rewire' "$ROOT/android-v04-challenge.xml"
grep -q 'Day 1 of 32' "$ROOT/android-v04-challenge.xml"
tap_label "$ROOT/android-v04-challenge.xml" 'Challenge Day 1 Notice the Autopilot'
sleep 1
pull_ui /sdcard/v04-challenge-day1.xml "$ROOT/android-v04-challenge-day1.xml"
tap_label "$ROOT/android-v04-challenge-day1.xml" 'Complete Challenge Day 1'
sleep 1
pull_ui /sdcard/v04-challenge-complete.xml "$ROOT/android-v04-challenge-complete.xml"
grep -q '1/32 complete' "$ROOT/android-v04-challenge-complete.xml"
scroll_top
pull_ui /sdcard/v04-challenge-top.xml "$ROOT/android-v04-challenge-top.xml"
tap_label "$ROOT/android-v04-challenge-top.xml" 'Close 32-Day Rewire'
sleep 2

stage layered-meditation
pull_ui /sdcard/v04-practice-final.xml "$ROOT/android-v04-practice-final.xml"
# Deep Rest is below the tools but usually visible; scroll until the accessibility label appears.
for _ in 1 2 3; do
  if grep -q 'Start Deep Rest' "$ROOT/android-v04-practice-final.xml"; then break; fi
  scroll_down
  pull_ui /sdcard/v04-practice-final.xml "$ROOT/android-v04-practice-final.xml"
done
tap_label "$ROOT/android-v04-practice-final.xml" 'Start Deep Rest'
sleep 2
pull_ui /sdcard/v04-session-before.xml "$ROOT/android-v04-session-before.xml"
grep -q 'Warm Female' "$ROOT/android-v04-session-before.xml"
grep -q 'Deep Male' "$ROOT/android-v04-session-before.xml"
tap_label "$ROOT/android-v04-session-before.xml" 'Narrator Deep Male'
tap_label "$ROOT/android-v04-session-before.xml" 'Frequency Theta 6 Hz'
sleep 2
pull_ui /sdcard/v04-session-configured.xml "$ROOT/android-v04-session-configured.xml"
grep -q 'Ocean' "$ROOT/android-v04-session-configured.xml"
grep -q 'Theta 6 Hz' "$ROOT/android-v04-session-configured.xml"
tap_label "$ROOT/android-v04-session-configured.xml" 'Start Deep Rest'
sleep 5
pull_ui /sdcard/v04-session-playing.xml "$ROOT/android-v04-session-playing.xml"
grep -q 'Natural narration' "$ROOT/android-v04-session-playing.xml"
grep -q 'Meditation sound' "$ROOT/android-v04-session-playing.xml"
grep -q 'Ocean' "$ROOT/android-v04-session-playing.xml"
grep -q 'Theta 6 Hz' "$ROOT/android-v04-session-playing.xml"
adb shell dumpsys audio > "$ROOT/android-v04-audio.txt"
ACTIVE_COUNT=$(grep -Ec "AudioPlaybackConfiguration .*u/pid:[0-9]+/${APP_PID} state:started" "$ROOT/android-v04-audio.txt" || true)
echo "ANDROID_V04_ACTIVE_AUDIO_TRACKS=$ACTIVE_COUNT"
test "$ACTIVE_COUNT" -ge 2

stage final-checks
adb logcat -d > "$ROOT/android-v04-logcat.txt"
! grep -q 'FATAL EXCEPTION' "$ROOT/android-v04-logcat.txt"
! grep -qi 'Unable to load script' "$ROOT"/android-v04-*.xml "$ROOT/android-v04-logcat.txt"
adb shell pidof "$APP_ID" >/dev/null
adb shell dumpsys package "$APP_ID" | grep -q 'versionName=0.4.0'
adb exec-out screencap -p > "$ROOT/android-v04-smoke.png"
trap - EXIT
stage complete
echo 'ANDROID_V04_SMOKE_OK'
