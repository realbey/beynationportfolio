import React, { memo, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, textGlow } from '../constants/theme';

/*
  Hero3DScene
  -----------
  A glass "digital matrix" artifact: an outer cube, a counter-rotating inner cube,
  two orbit rings and three orbiting nodes.

  How the 3D works (no extra libraries, no JS-thread work per frame):
  - One shared value (`spin`) loops 0 -> 2π on the UI thread. Drag adds to `dragX/dragY`.
  - For every plane, a worklet builds its 3x3 rotation matrix R = Ry * Rx * orientation,
    finds the plane's centre in 3D (R * localOffset), and projects it with perspective.
  - React Native has no translateZ, so each plane is placed using
      [perspective, translateX, translateY, scale, rotateY, rotateX, rotateZ]
    where the rotation angles are Euler angles extracted from R. This is plain RN
    transforms, so it renders identically on Android, iOS and web.
  - Depth drives opacity, zIndex and a light-direction term (lambert) for the lighting response.
*/

const TAU = Math.PI * 2;
const LIGHT = [-0.42, -0.58, 0.69]; // light comes from the upper left, towards the viewer

function rotY3(t) {
  'worklet';
  const c = Math.cos(t);
  const s = Math.sin(t);
  return [c, 0, s, 0, 1, 0, -s, 0, c];
}

function rotX3(t) {
  'worklet';
  const c = Math.cos(t);
  const s = Math.sin(t);
  return [1, 0, 0, 0, c, -s, 0, s, c];
}

function mul3(a, b) {
  'worklet';
  const o = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      o[r * 3 + c] = a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c];
    }
  }
  return o;
}

function smooth(e0, e1, x) {
  'worklet';
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

const IDENTITY = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const ORIENT = {
  front: IDENTITY,
  back: rotY3(Math.PI),
  right: rotY3(Math.PI / 2),
  left: rotY3(-Math.PI / 2),
  top: rotX3(Math.PI / 2),
  bottom: rotX3(-Math.PI / 2),
};

const FACES = [
  { key: 'front', glyph: '</>' },
  { key: 'back', glyph: '{ }' },
  { key: 'right', glyph: 'RN' },
  { key: 'left', glyph: 'JS' },
  { key: 'top', glyph: 'DB' },
  { key: 'bottom', glyph: 'UI' },
];

const Plane = memo(function Plane({
  kind = 'face', // 'face' | 'ring' | 'dot'
  size,
  half = 0,
  orient = IDENTITY,
  spinY = 1,
  wobble = 0.25,
  phase = 0,
  tilt = -0.42,
  dragMul = 1,
  persp,
  orbit,
  baseOpacity = 1,
  shared,
  children,
}) {
  const { spin, dragX, dragY, touch } = shared;

  const animated = useAnimatedStyle(() => {
    const ay = spin.value * spinY + dragY.value * dragMul;
    const ax = tilt + Math.sin(spin.value + phase) * wobble + dragX.value * dragMul;
    const R = mul3(rotY3(ay), mul3(rotX3(ax), orient));

    // Plane centre in 3D (view space, +z towards the viewer)
    let lx = 0;
    let ly = 0;
    let lz = half;
    if (kind === 'dot') {
      const phi = spin.value * orbit.speed + orbit.phase;
      lx = orbit.radius * Math.cos(phi);
      ly = orbit.radius * Math.sin(phi);
      lz = 0;
    }
    const px = R[0] * lx + R[1] * ly + R[2] * lz;
    const py = R[3] * lx + R[4] * ly + R[5] * lz;
    const pz = R[6] * lx + R[7] * ly + R[8] * lz;
    const k = persp / (persp - pz); // perspective scale at the plane centre
    const boost = touch.value;

    if (kind === 'dot') {
      const depth = (pz / orbit.radius + 1) / 2;
      return {
        opacity: Math.min(1, 0.25 + depth * 0.75 + boost * 0.1),
        zIndex: Math.round(pz + 1000),
        transform: [{ translateX: px * k }, { translateY: py * k }, { scale: k }],
      };
    }

    // Surface normal = third column of R
    const nx = R[2];
    const ny = R[5];
    const nz = R[8];
    const lambert = Math.max(0, nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]);
    const facing = kind === 'ring' ? 1 : smooth(-0.22, 0.22, nz);
    const opacity =
      kind === 'ring'
        ? baseOpacity * (0.55 + boost * 0.25)
        : baseOpacity * (0.09 + facing * (0.22 + 0.5 * lambert + boost * 0.18));

    // Euler angles for the order rotateY -> rotateX -> rotateZ
    const b = Math.asin(Math.max(-1, Math.min(1, -R[5])));
    const a = Math.atan2(R[2], R[8]);
    const g = Math.atan2(R[3], R[4]);

    return {
      opacity: Math.min(1, opacity),
      zIndex: kind === 'ring' ? 2000 : Math.round(pz + 1000),
      transform: [
        { perspective: persp - pz },
        { translateX: px * k },
        { translateY: py * k },
        { scale: k },
        { rotateY: a + 'rad' },
        { rotateX: b + 'rad' },
        { rotateZ: g + 'rad' },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          left: '50%',
          top: '50%',
          marginLeft: -size / 2,
          marginTop: -size / 2,
        },
        animated,
      ]}
    >
      {children}
    </Animated.View>
  );
});

const FaceArt = memo(function FaceArt({ size, glyph, tint, radius }) {
  const third = size / 3;
  return (
    <View style={[styles.face, { width: size, height: size, borderRadius: radius }]}>
      <LinearGradient
        colors={tint}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {[1, 2].map((i) => (
        <View key={'v' + i} style={[styles.lineV, { left: third * i }]} />
      ))}
      {[1, 2].map((i) => (
        <View key={'h' + i} style={[styles.lineH, { top: third * i }]} />
      ))}
      {[
        [6, 6],
        [size - 12, 6],
        [6, size - 12],
        [size - 12, size - 12],
      ].map((p, i) => (
        <View key={'n' + i} style={[styles.node, { left: p[0], top: p[1] }]} />
      ))}
      <View style={styles.glyphWrap}>
        <Text style={[styles.glyph, { fontSize: Math.max(11, size * 0.17) }, textGlow(colors.cyan, 10)]}>{glyph}</Text>
      </View>
    </View>
  );
});

export default function Hero3DScene({ size = 320 }) {
  const spin = useSharedValue(0);
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const touch = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    spin.value = withRepeat(withTiming(TAU, { duration: 26000, easing: Easing.linear }), -1, false);
    pulse.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.quad) }), -1, true);
    return () => {
      cancelAnimation(spin);
      cancelAnimation(pulse);
    };
  }, [spin, pulse]);

  const shared = useMemo(() => ({ spin, dragX, dragY, touch }), [spin, dragX, dragY, touch]);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-8, 8])
        .failOffsetY([-24, 24])
        .onBegin(() => {
          touch.value = withTiming(1, { duration: 220 });
        })
        .onChange((e) => {
          dragY.value += e.changeX * 0.012;
          const next = dragX.value - e.changeY * 0.012;
          dragX.value = Math.max(-1.1, Math.min(1.1, next));
        })
        .onEnd((e) => {
          dragY.value = withDecay({ velocity: e.velocityX * 0.012, deceleration: 0.996 });
        })
        .onFinalize(() => {
          touch.value = withTiming(0, { duration: 700 });
          dragX.value = withSpring(0, { damping: 12, stiffness: 55 });
        }),
    [touch, dragX, dragY]
  );

  const persp = size * 2.5; // 800 at the default size
  const cube = size * 0.46;
  const inner = size * 0.2;
  const ring = size * 0.86;

  const coreStyle = useAnimatedStyle(() => ({
    opacity: 0.55 + pulse.value * 0.4,
    transform: [{ scale: 0.9 + pulse.value * 0.35 }],
    zIndex: 1000,
  }));
  const groundStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + pulse.value * 0.25,
    transform: [{ scaleX: 1 + pulse.value * 0.08 }],
  }));

  const ringA = { orient: IDENTITY, spinY: -1, wobble: 0.2, phase: 1, tilt: -0.42 };
  const ringB = { orient: ORIENT.top, spinY: 1, wobble: 0.2, phase: 0, tilt: -0.42 };

  return (
    <View style={styles.outer}>
      <GestureDetector gesture={pan}>
        <View
          style={{ width: size, height: size }}
          accessible
          accessibilityRole="image"
          accessibilityLabel="Interactive 3D glass cube. Drag to rotate."
        >
          {/* ground glow */}
          <Animated.View style={[styles.ground, { width: size * 0.5, height: size * 0.07, bottom: size * 0.01 }, groundStyle]}>
            <LinearGradient
              colors={['rgba(0,240,255,0.28)', 'rgba(0,240,255,0)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          {/* orbit rings */}
          <Plane kind="ring" size={ring} persp={persp} shared={shared} baseOpacity={0.85} {...ringA}>
            <View style={[styles.ring, { width: ring, height: ring, borderRadius: ring / 2, borderColor: 'rgba(56,189,248,0.75)' }]} />
          </Plane>
          <Plane kind="ring" size={ring} persp={persp} shared={shared} baseOpacity={0.85} {...ringB}>
            <View style={[styles.ring, { width: ring, height: ring, borderRadius: ring / 2, borderColor: 'rgba(0,240,255,0.8)' }]} />
          </Plane>

          {/* outer cube */}
          {FACES.map((f) => (
            <Plane
              key={f.key}
              size={cube}
              half={cube / 2}
              orient={ORIENT[f.key]}
              spinY={1}
              wobble={0.28}
              phase={0}
              tilt={-0.42}
              persp={persp}
              shared={shared}
            >
              <FaceArt size={cube} glyph={f.glyph} radius={8} tint={['rgba(0,240,255,0.34)', 'rgba(56,189,248,0.06)']} />
            </Plane>
          ))}

          {/* inner cube (counter rotation) */}
          {FACES.map((f) => (
            <Plane
              key={'i' + f.key}
              size={inner}
              half={inner / 2}
              orient={ORIENT[f.key]}
              spinY={-2}
              wobble={-0.3}
              phase={1.3}
              tilt={0.3}
              dragMul={-1.4}
              persp={persp}
              shared={shared}
              baseOpacity={1}
            >
              <FaceArt size={inner} glyph="" radius={4} tint={['rgba(11,95,255,0.7)', 'rgba(0,240,255,0.25)']} />
            </Plane>
          ))}

          {/* orbiting nodes */}
          <Plane
            kind="dot"
            size={12}
            persp={persp}
            shared={shared}
            orient={ringB.orient}
            spinY={ringB.spinY}
            wobble={ringB.wobble}
            phase={ringB.phase}
            tilt={ringB.tilt}
            orbit={{ radius: ring / 2, speed: 2, phase: 0 }}
          >
            <View style={styles.dot} />
          </Plane>
          <Plane
            kind="dot"
            size={12}
            persp={persp}
            shared={shared}
            orient={ringB.orient}
            spinY={ringB.spinY}
            wobble={ringB.wobble}
            phase={ringB.phase}
            tilt={ringB.tilt}
            orbit={{ radius: ring / 2, speed: 2, phase: Math.PI }}
          >
            <View style={[styles.dot, styles.dotBlue]} />
          </Plane>
          <Plane
            kind="dot"
            size={12}
            persp={persp}
            shared={shared}
            orient={ringA.orient}
            spinY={ringA.spinY}
            wobble={ringA.wobble}
            phase={ringA.phase}
            tilt={ringA.tilt}
            orbit={{ radius: ring / 2, speed: -3, phase: 1 }}
          >
            <View style={styles.dot} />
          </Plane>

          {/* glowing core */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.core,
              { width: size * 0.1, height: size * 0.1, borderRadius: size * 0.05, left: size / 2 - size * 0.05, top: size / 2 - size * 0.05 },
              coreStyle,
            ]}
          />
        </View>
      </GestureDetector>
      <Text style={styles.hint}>DRAG TO ROTATE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { alignItems: 'center' },
  ground: { position: 'absolute', alignSelf: 'center', borderRadius: 999, overflow: 'hidden' },
  ring: { borderWidth: 1.5, backgroundColor: 'transparent' },
  face: {
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(0,240,255,0.9)',
    backgroundColor: 'rgba(0,240,255,0.04)',
  },
  lineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(0,240,255,0.28)' },
  lineH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(0,240,255,0.28)' },
  node: { position: 'absolute', width: 6, height: 6, backgroundColor: colors.cyan },
  glyphWrap: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  glyph: { fontFamily: fonts.mono, fontWeight: '700', color: colors.cyan, letterSpacing: 1 },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.cyan,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  dotBlue: { backgroundColor: colors.blue },
  core: { position: 'absolute', backgroundColor: '#E6FEFF', borderWidth: 3, borderColor: colors.cyan },
  hint: {
    marginTop: 6,
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 3,
    color: colors.textDim,
  },
});
