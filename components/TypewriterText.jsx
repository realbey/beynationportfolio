import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, glowShadow, textGlow } from '../constants/theme';

// Types a phrase, holds it, deletes it, then moves to the next one.
// The cursor blinks on the UI thread with Reanimated.
export default function TypewriterText({
  phrases,
  typeSpeed = 62,
  deleteSpeed = 30,
  holdMs = 1700,
  style,
  minHeight,
  cursorColor = colors.cyan,
}) {
  const list = useMemo(() => (phrases && phrases.length ? phrases : ['']), [phrases]);
  const [text, setText] = useState('');
  const blink = useSharedValue(1);

  useEffect(() => {
    blink.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 420, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 420, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
    return () => cancelAnimation(blink);
  }, [blink]);

  useEffect(() => {
    let cancelled = false;
    let timer = null;
    let phraseIndex = 0;
    let count = 0;
    let deleting = false;

    const tick = () => {
      if (cancelled) return;
      const full = list[phraseIndex % list.length];
      if (!deleting) {
        count += 1;
        setText(full.slice(0, count));
        if (count >= full.length) {
          deleting = true;
          timer = setTimeout(tick, holdMs);
          return;
        }
        timer = setTimeout(tick, typeSpeed + Math.random() * 38);
      } else {
        count -= 1;
        setText(full.slice(0, Math.max(0, count)));
        if (count <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % list.length;
          timer = setTimeout(tick, 360);
          return;
        }
        timer = setTimeout(tick, deleteSpeed);
      }
    };

    timer = setTimeout(tick, 500);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [list, typeSpeed, deleteSpeed, holdMs]);

  const cursorStyle = useAnimatedStyle(() => ({ opacity: blink.value }));
  const fontSize = (style && style.fontSize) || 22;

  return (
    <View style={[styles.row, minHeight ? { minHeight } : null]}>
      <Text style={[styles.text, style]} accessibilityLabel={list[0]}>
        {text}
      </Text>
      <Animated.View
        style={[
          styles.cursor,
          { height: fontSize * 1.15, backgroundColor: cursorColor },
          glowShadow(cursorColor, 10, 0.9),
          cursorStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap' },
  text: {
    flexShrink: 1,
    fontSize: 22,
    fontWeight: '700',
    color: colors.blue,
    ...textGlow('rgba(56,189,248,0.6)', 10),
  },
  cursor: { width: 3, marginLeft: 4, borderRadius: 2 },
});
