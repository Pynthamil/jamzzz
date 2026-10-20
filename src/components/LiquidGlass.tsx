import React from 'react';
import { View, Platform, ViewProps, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';

let GlassViewComponent: any = null;
let isNativeAvailable = false;

try {
  const glassModule = require('expo-glass-effect');
  if (glassModule) {
    if (typeof glassModule.isLiquidGlassAvailable === 'function') {
      isNativeAvailable = glassModule.isLiquidGlassAvailable();
    } else {
      isNativeAvailable = true;
    }
    GlassViewComponent = glassModule.GlassView;
  }
} catch {
  isNativeAvailable = false;
}

export interface LiquidGlassProps extends ViewProps {
  children?: React.ReactNode;
  glassStyle?: 'regular' | 'clear' | 'none';
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  borderRadius?: number;
}

export const LiquidGlass: React.FC<LiquidGlassProps> = ({
  children,
  glassStyle = 'regular',
  intensity = 70,
  tint,
  style,
  borderRadius,
  ...rest
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const effectiveTint = tint || (isDark ? 'dark' : 'light');

  if (Platform.OS === 'ios' && isNativeAvailable && GlassViewComponent) {
    try {
      return (
        <GlassViewComponent
          glassEffectStyle={glassStyle}
          colorScheme={isDark ? 'dark' : 'light'}
          style={[{ borderRadius, overflow: 'hidden' }, style]}
          {...rest}
        >
          {children}
        </GlassViewComponent>
      );
    } catch {
      // Fallback to BlurView if native rendering throws
    }
  }

  return (
    <BlurView
      intensity={intensity}
      tint={effectiveTint}
      style={[{ borderRadius, overflow: 'hidden' }, style]}
      {...rest}
    >
      {children}
    </BlurView>
  );
};
