import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, fonts } from '../constants/theme';

// Endless horizontal ticker. The row holds N identical groups; it slides by exactly one
// group width and restarts, so the loop has no visible seam. Edges fade into the background.
export default function Marquee({ items, speed = 55, reverse = false, style, textStyle, fadeColor = colors.bg }) {
  const [groupWidth, setGroupWidth] = useState(0);
  const [boxWidth, setBoxWidth] = useState(0);
  const x = useSharedValue(0);

  const list = items && items.length ? items : [''];
  const copies = groupWidth > 0 && boxWidth > 0 ? Math.max(2, Math.ceil(boxWidth / groupWidth) + 1) : 2;

  useEffect(() => {
    if (!groupWidth) return undefined;
    cancelAnimation(x);
    const from = reverse ? -groupWidth : 0;
    const to = reverse ? 0 : -groupWidth;
    x.value = from;
    x.value = withRepeat(
      withTiming(to, { duration: (groupWidth / speed) * 1000, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(x);
  }, [groupWidth, speed, reverse, x]);

  const animated = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  const group = (key, measure) => (
    <View
      key={key}
      style={styles.group}
      onLayout={
        measure
          ? (e) => {
              const w = e.nativeEvent.layout.width;
              if (w > 0 && Math.abs(w - groupWidth) > 0.5) setGroupWidth(w);
            }
          : undefined
      }
    >
      {list.map((label, i) => (
        <View key={key + i} style={styles.item}>
          <Text style={[styles.text, textStyle]} numberOfLines={1}>
            {label}
          </Text>
          <View style={styles.diamond} />
        </View>
      ))}
    </View>
  );

  return (
    <View
      style={[styles.wrap, style]}
      onLayout={(e) => setBoxWidth(e.nativeEvent.layout.width)}
      accessibilityRole="text"
      accessibilityLabel={list.join(', ')}
    >
      <Animated.View style={[styles.row, animated, { opacity: groupWidth ? 1 : 0 }]}>
        {Array.from({ length: copies }).map((_, i) => group('g' + i, i === 0))}
      </Animated.View>
      <LinearGradient
        pointerEvents="none"
        colors={[fadeColor, 'rgba(5,11,20,0)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.fade, { left: 0 }]}
      />
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(5,11,20,0)', fadeColor]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.fade, { right: 0 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
  },
  row: { flexDirection: 'row', alignSelf: 'flex-start' },
  group: { flexDirection: 'row', flexShrink: 0 },
  item: { flexDirection: 'row', alignItems: 'center', flexShrink: 0 },
  text: {
    fontFamily: fonts.mono,
    fontSize: 15,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: colors.textMuted,
    fontWeight: '600',
    paddingLeft: 26,
  },
  diamond: {
    width: 7,
    height: 7,
    marginLeft: 26,
    backgroundColor: colors.cyan,
    transform: [{ rotate: '45deg' }],
    opacity: 0.8,
  },
  fade: { position: 'absolute', top: 0, bottom: 0, width: 56 },
});
