import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme';

export function BreathOrb({ active = true }: { active?: boolean }) {
  const scale = useRef(new Animated.Value(0.78)).current;
  const opacity = useRef(new Animated.Value(0.68)).current;

  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, { toValue: 1.12, duration: 4500, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 4500, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale, { toValue: 0.78, duration: 5500, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.68, duration: 5500, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, opacity, scale]);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: 210 }}>
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <LinearGradient colors={[COLORS.violet, COLORS.indigo, '#312E81']} style={{ width: 142, height: 142, borderRadius: 71, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 112, height: 112, borderRadius: 56, backgroundColor: '#0C1020CC', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: COLORS.text, fontWeight: '700' }}>Breathe</Text>
            <Text style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>easy & unforced</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}
