import React from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Fades and lifts content in when it first appears. Runs on the UI thread.
export default function Reveal({ delay = 0, children, style }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(650)} style={style}>
      {children}
    </Animated.View>
  );
}
