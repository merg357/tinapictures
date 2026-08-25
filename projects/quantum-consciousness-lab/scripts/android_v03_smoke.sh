#!/usr/bin/env bash
set -euo pipefail

APK=projects/quantum-consciousness-lab/ConsciousnessLab-v0.3.0-universal-standalone.apk
APP_ID=com.merg357.consciousnesslab
ROOT=projects/quantum-consciousness-lab

pull_ui() {
  local remote="$1"
  local local_file="$2"
  adb shell uiautomator dump "$remote" >/dev/null 2>&1
  adb pull "$remote" "$local_file" >/dev/null 2>&1
}

tap_label() {
  local xml="$1"
  local label="$2"
  local coords x y
  coords=$(XML="$xml" LABEL="$label" python3 - <<'PY'
import os
import re
from html import unescape

path = os.environ['XML']
label = os.environ['LABEL']
s = open(path, encoding='utf-8').read()

for node in re.findall(r'<node\b[^>]*>', s):
    text_m = re.search(r'text="([^"]*)"', node)
    desc_m = re.search(r'content-desc="([^"]*)"', node)
    candidates = []
    if text_m:
        candidates.append(unescape(text_m.group(1)))
    if desc_m:
        candidates.append(unescape(desc_m.group(1)))
    if label not in candidates:
        continue
    bounds = re.search(r'bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"', node)
    if bounds:
        a, b, c, d = map(int, bounds.groups())
        print((a + c) // 2, (b + d) // 2)
        raise SystemExit(0)

raise SystemExit(f'label not found: {label}')
PY
)
  read -r x y <<<"$coords"
  adb shell input tap "$x" "$y"
}

adb install -r "$APK"
adb logcat -c
adb shell am force-stop "$APP_ID"
adb shell monkey -p "$APP_ID" -c android.intent.category.LAUNCHER 1 >/dev/null
sleep 10

pull_ui /sdcard/onboarding.xml "$ROOT/android-onboarding.xml"
grep -q 'Enter the Lab' "$ROOT/android-onboarding.xml"
tap_label "$ROOT/android-onboarding.xml" 'Enter the Lab'
sleep 4

pull_ui /sdcard/home.xml "$ROOT/android-home.xml"
grep -q 'How do you want to feel?' "$ROOT/android-home.xml"
for tab in Home Practice Explore Lab Journal; do
  grep -q "$tab" "$ROOT/android-home.xml"
done
tap_label "$ROOT/android-home.xml" 'Practice'
sleep 3

pull_ui /sdcard/practice.xml "$ROOT/android-practice.xml"
grep -q 'Choose a path' "$ROOT/android-practice.xml"
grep -q 'Deep Rest' "$ROOT/android-practice.xml"
tap_label "$ROOT/android-practice.xml" 'Start Deep Rest'
sleep 3

pull_ui /sdcard/session-before.xml "$ROOT/android-session-before.xml"
grep -q 'Warm Female' "$ROOT/android-session-before.xml"
grep -q 'Deep Male' "$ROOT/android-session-before.xml"
grep -q 'Android system TTS is not used' "$ROOT/android-session-before.xml"
tap_label "$ROOT/android-session-before.xml" 'Narrator Deep Male'
sleep 2

pull_ui /sdcard/session-preview.xml "$ROOT/android-session-preview.xml"
grep -q 'Natural narration' "$ROOT/android-session-preview.xml"
tap_label "$ROOT/android-session-preview.xml" 'Start Deep Rest'
sleep 4

pull_ui /sdcard/session-running.xml "$ROOT/android-session-running.xml"
grep -q 'Natural narration · playing' "$ROOT/android-session-running.xml"
grep -q 'Voice: Deep Male' "$ROOT/android-session-running.xml"

adb exec-out screencap -p > "$ROOT/android-smoke.png"
adb logcat -d > "$ROOT/android-logcat.txt"
! grep -qi 'Unable to load script' "$ROOT"/android-*.xml "$ROOT/android-logcat.txt"
! grep -q 'FATAL EXCEPTION' "$ROOT/android-logcat.txt"
grep -Fq 'Running "main"' "$ROOT/android-logcat.txt"
adb shell pidof "$APP_ID" >/dev/null

echo 'ANDROID_V03_SMOKE_OK'
