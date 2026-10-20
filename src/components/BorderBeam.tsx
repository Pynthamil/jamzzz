import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  LayoutChangeEvent,
  ViewStyle,
  StyleProp,
} from 'react-native';

export interface BorderBeamProps {
  children?: React.ReactNode;
  /** Whether the beam animation is actively running. Defaults to true. */
  active?: boolean;
  /** Size of the beam in pixels. Defaults to 100. */
  size?: number;
  /** Duration of one full loop in seconds. Defaults to 6. */
  duration?: number;
  /** Border width of the beam path. Defaults to 1.5. */
  borderWidth?: number;
  /** Color of the leading head. Defaults to electric cyan/white. */
  colorFrom?: string;
  /** Color of the mid/trail. Defaults to warm orange/violet. */
  colorTo?: string;
  /** Border radius of the container. Defaults to 27. */
  borderRadius?: number;
  /** Additional wrapper style */
  style?: StyleProp<ViewStyle>;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  children,
  active = true,
  size = 110,
  duration = 5,
  borderWidth = 1.5,
  colorFrom = '#38BDF8',
  colorTo = '#A855F7',
  borderRadius = 27,
  style,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      rotateAnim.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: duration * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();

    return () => loop.stop();
  }, [active, duration, rotateAnim]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== dimensions.width || height !== dimensions.height) {
      setDimensions({ width, height });
    }
  };

  const { width, height } = dimensions;
  // Dimensions for the rotating disc: must cover the full boundary
  const diagonal = Math.sqrt(width * width + height * height) || 300;
  const discSize = diagonal;

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.container,
        {
          borderRadius,
          padding: borderWidth,
        },
        style,
      ]}
    >
      {/* Background static glass border */}
      <View
        style={[
          styles.staticBorder,
          {
            borderRadius,
            borderColor: 'rgba(255, 255, 255, 0.12)',
            borderWidth,
          },
        ]}
      />

      {/* Rotating Traveling Rainbow Beam Layer */}
      {active && width > 0 && height > 0 && (
        <View
          style={[
            styles.beamMask,
            {
              borderRadius,
            },
          ]}
          pointerEvents="none"
        >
          <Animated.View
            style={[
              styles.rotatingDisc,
              {
                width: discSize,
                height: discSize,
                marginLeft: -discSize / 2,
                marginTop: -discSize / 2,
                left: width / 2,
                top: height / 2,
                transform: [{ rotate: spin }],
              },
            ]}
          >
            {/* Rainbow Beam Segment 1: Leading Bright Head (Cyan / White) */}
            <View
              style={[
                styles.beamSegment,
                {
                  top: 0,
                  left: discSize / 2 - size / 2,
                  width: size,
                  height: size * 0.7,
                  borderRadius: size / 2,
                  backgroundColor: colorFrom,
                  shadowColor: colorFrom,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 16,
                  elevation: 10,
                },
              ]}
            />

            {/* Rainbow Beam Segment 2: Warm Sunset Center (Orange / Gold) */}
            <View
              style={[
                styles.beamSegment,
                {
                  top: 15,
                  left: discSize / 2 - (size * 1.2) / 2 + 30,
                  width: size * 1.1,
                  height: size * 0.6,
                  borderRadius: (size * 1.1) / 2,
                  backgroundColor: '#FB923C',
                  shadowColor: '#FB923C',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.9,
                  shadowRadius: 20,
                  elevation: 8,
                },
              ]}
            />

            {/* Rainbow Beam Segment 3: Trailing Glow (Magenta / Purple) */}
            <View
              style={[
                styles.beamSegment,
                {
                  top: 35,
                  left: discSize / 2 - (size * 1.3) / 2 + 60,
                  width: size * 1.3,
                  height: size * 0.7,
                  borderRadius: (size * 1.3) / 2,
                  backgroundColor: colorTo,
                  shadowColor: colorTo,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.85,
                  shadowRadius: 24,
                  elevation: 6,
                },
              ]}
            />
          </Animated.View>
        </View>
      )}

      {/* Child Content (e.g. Card) rendered on top */}
      <View
        style={[
          styles.innerContent,
          { borderRadius: Math.max(0, borderRadius - borderWidth) },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
  },
  staticBorder: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
  beamMask: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  rotatingDisc: {
    position: 'absolute',
  },
  beamSegment: {
    position: 'absolute',
    opacity: 0.95,
  },
  innerContent: {
    width: '100%',
    overflow: 'hidden',
    zIndex: 1,
  },
});

export default BorderBeam;
