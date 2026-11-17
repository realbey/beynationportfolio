import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Icon from './Icon';
import { colors, glowShadow, gradients, radii } from '../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// variant: 'primary' | 'ghost' | 'danger'   size: 'md' | 'sm'
export default function Button({
  title,
  onPress,
  icon,
  iconRight,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
}) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const isPrimary = variant === 'primary';
  const fg = isPrimary ? colors.onAccent : variant === 'danger' ? colors.danger : colors.cyan;
  const small = size === 'sm';

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 18, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 240 });
      }}
      style={[
        styles.base,
        small ? styles.small : styles.medium,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        isPrimary && glowShadow(colors.cyan, 16, 0.35),
        (disabled || loading) && styles.disabled,
        style,
        animated,
      ]}
    >
      {isPrimary ? (
        <LinearGradient
          colors={gradients.accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator size="small" color={fg} />
        ) : icon ? (
          <Icon name={icon} size={small ? 16 : 18} color={fg} />
        ) : null}
        <Text style={[styles.text, small && styles.textSmall, { color: fg }]}>{title}</Text>
        {iconRight ? <Icon name={iconRight} size={small ? 16 : 18} color={fg} /> : null}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.pill,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medium: { paddingVertical: 13, paddingHorizontal: 22 },
  small: { paddingVertical: 8, paddingHorizontal: 14 },
  ghost: { borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: 'rgba(0,240,255,0.06)' },
  danger: { borderWidth: 1, borderColor: 'rgba(251,113,133,0.5)', backgroundColor: 'rgba(251,113,133,0.08)' },
  disabled: { opacity: 0.55 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  textSmall: { fontSize: 13 },
});
