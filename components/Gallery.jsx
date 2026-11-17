import React, { useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from './Icon';
import { colors, fonts, radii } from '../constants/theme';

// A slide is either an image URL (string) or a generated placeholder
// { gradient: [c1, c2], icon: 'ionicon-name', caption: 'text' }.
export function MediaSlide({ item, height, rounded = true, compact = false }) {
  const radius = rounded ? radii.lg : 0;
  if (typeof item === 'string') {
    return (
      <Image
        source={{ uri: item }}
        resizeMode="cover"
        style={{ width: '100%', height, borderRadius: radius, backgroundColor: colors.surfaceSolid }}
        accessibilityIgnoresInvertColors
      />
    );
  }
  const slide = item || {};
  return (
    <LinearGradient
      colors={slide.gradient || ['#0B5FFF', '#00F0FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: '100%', height, borderRadius: radius, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* faux app window chrome */}
      <View style={styles.chrome}>
        <View style={styles.chromeDot} />
        <View style={styles.chromeDot} />
        <View style={styles.chromeDot} />
      </View>
      <View style={[styles.skeletonA, compact && { opacity: 0.5 }]} />
      <View style={[styles.skeletonB, compact && { opacity: 0.5 }]} />
      <Icon name={slide.icon || 'cube'} size={compact ? 44 : 72} color="rgba(255,255,255,0.92)" />
      {slide.caption && !compact ? <Text style={styles.caption}>{slide.caption}</Text> : null}
    </LinearGradient>
  );
}

export default function Gallery({ items, height = 280 }) {
  const list = items && items.length ? items : [{ gradient: ['#0B5FFF', '#00F0FF'], icon: 'cube', caption: 'Preview' }];
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const ref = useRef(null);

  const go = (n) => {
    const next = Math.max(0, Math.min(list.length - 1, n));
    setIndex(next);
    if (ref.current && width) ref.current.scrollTo({ x: next * width, animated: true });
  };

  return (
    <View style={styles.wrap} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 ? (
        <ScrollView
          ref={ref}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e) => {
            const i = Math.round(e.nativeEvent.contentOffset.x / width);
            if (i !== index) setIndex(i);
          }}
          style={{ borderRadius: radii.lg }}
        >
          {list.map((item, i) => (
            <View key={i} style={{ width, height }}>
              <MediaSlide item={item} height={height} />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={{ height }} />
      )}

      {list.length > 1 ? (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous image"
            onPress={() => go(index - 1)}
            style={[styles.arrow, { left: 10, opacity: index === 0 ? 0.35 : 1 }]}
          >
            <Icon name="chevron-back" size={20} color={colors.text} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next image"
            onPress={() => go(index + 1)}
            style={[styles.arrow, { right: 10, opacity: index === list.length - 1 ? 0.35 : 1 }]}
          >
            <Icon name="chevron-forward" size={20} color={colors.text} />
          </Pressable>
          <View style={styles.dots}>
            {list.map((_, i) => (
              <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSolid,
  },
  chrome: { position: 'absolute', top: 12, left: 14, flexDirection: 'row', gap: 6 },
  chromeDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.45)' },
  skeletonA: {
    position: 'absolute',
    left: '8%',
    right: '38%',
    bottom: '14%',
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  skeletonB: {
    position: 'absolute',
    left: '8%',
    right: '58%',
    bottom: '7%',
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  caption: {
    marginTop: 14,
    fontFamily: fonts.mono,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.92)',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(5,11,20,0.62)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dots: { position: 'absolute', bottom: 10, alignSelf: 'center', flexDirection: 'row', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { width: 20, backgroundColor: colors.cyan },
});
