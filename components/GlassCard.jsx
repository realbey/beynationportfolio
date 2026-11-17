import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, glowShadow, radii } from '../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Glassmorphism panel: blur (iOS/web), translucent fill, fine cyan border and a soft highlight.
export default function GlassCard({
  children,
  style,
  innerStyle,
  onPress,
  glow = false,
  padded = true,
  accessibilityLabel,
}) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const body = (
    <>
      {Platform.OS !== 'android' ? (
        <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
      ) : null}
      <LinearGradient
        colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={[padded ? styles.padded : null, innerStyle]}>{children}</View>
    </>
  );

  if (!onPress) {
    return <View style={[styles.card, glow && glowShadow(colors.cyan, 20, 0.28), style]}>{body}</View>;
  }

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.98, { damping: 18, stiffness: 260 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 220 });
      }}
      style={[styles.card, glow && glowShadow(colors.cyan, 20, 0.28), style, animated]}
    >
      {body}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  padded: { padding: 18 },
});
