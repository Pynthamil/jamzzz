import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { fonts } from '../theme/typography';

export interface LuminousButtonProps {
  title?: string;
  icon?: keyof typeof Feather.glyphMap;
  iconPosition?: 'left' | 'right';
  iconSize?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  activeOpacity?: number;
  variant?: 'pill' | 'circle' | 'compact';
  children?: React.ReactNode;
  glowColor?: string;
  textColor?: string;
}

export const LuminousButton: React.FC<LuminousButtonProps> = ({
  title,
  icon,
  iconPosition = 'left',
  iconSize = 18,
  onPress = () => {},
  style,
  textStyle,
  disabled = false,
  activeOpacity = 0.82,
  variant = 'pill',
  children,
  glowColor = '#6CB5F4',
  textColor = '#000000',
}) => {
  const isCircle = variant === 'circle';
  const isCompact = variant === 'compact';

  const containerStyle = isCircle
    ? styles.circleContainer
    : isCompact
    ? styles.compactContainer
    : styles.pillContainer;

  const shapeStyle = isCircle
    ? styles.circleShape
    : isCompact
    ? styles.compactShape
    : styles.pillShape;

  const circle1Style = isCircle ? styles.circleInnerCircle1 : styles.pillInnerCircle1;
  const circle2Style = isCircle ? styles.circleInnerCircle2 : styles.pillInnerCircle2;
  const circle3Style = isCircle ? styles.circleInnerCircle3 : styles.pillInnerCircle3;
  const turquoiseStyle = isCircle ? styles.circleTurquoiseShade : styles.pillTurquoiseShade;

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.shadowGlow,
        { shadowColor: glowColor },
        containerStyle,
        disabled && styles.disabledContainer,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {/* 2000s Aqua Capsule with Colorpicked Border #221898 */}
      <View style={[styles.aquaBorder, shapeStyle]}>
        {/* Layer 1: Base Gradient Colorpicked from get pro (#B4D7FE -> #6EB4F7 -> #68B0F5 -> #95CBF6) */}
        <LinearGradient
          colors={['#B4D7FE', '#6EB4F7', '#68B0F5', '#95CBF6']}
          locations={[0, 0.42, 0.68, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Layer 2: Bottom Turquoise Shade (Iridescent bottom reflection from "get pro") */}
        <View pointerEvents="none" style={turquoiseStyle}>
          <LinearGradient
            colors={[
              'rgba(72, 218, 251, 0.0)',
              'rgba(72, 218, 251, 0.45)',
              'rgba(128, 235, 255, 0.85)',
            ]}
            locations={[0, 0.5, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Layer 3: Inner Circle 3 (Outer Gloss Meniscus - Top Half) */}
        <View pointerEvents="none" style={circle3Style}>
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.82)',
              'rgba(215, 235, 255, 0.38)',
              'rgba(175, 215, 255, 0.0)',
            ]}
            locations={[0, 0.52, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Layer 4: Inner Circle 2 (Mid Soft Dome Aura) */}
        <View pointerEvents="none" style={circle2Style}>
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.92)',
              'rgba(235, 246, 255, 0.62)',
              'rgba(195, 228, 255, 0.0)',
            ]}
            locations={[0, 0.48, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Layer 5: Inner Circle 1 (Innermost Pure White Core Highlight - Made wider across width!) */}
        <View pointerEvents="none" style={circle1Style}>
          <LinearGradient
            colors={[
              '#FFFFFF',
              'rgba(255, 255, 255, 0.95)',
              'rgba(255, 255, 255, 0.0)',
            ]}
            locations={[0, 0.45, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Layer 6: Fine Top Specular Rim Stroke */}
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, shapeStyle, styles.specularRim]}
        />

        {/* Layer 7: Content (Text + Icon or Children) with Inset Etched Shadow */}
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <Feather
              name={icon}
              size={iconSize}
              color={textColor}
              style={title ? styles.iconLeft : undefined}
            />
          )}

          {title ? (
            <Text
              style={[
                styles.buttonText,
                { color: textColor },
                isCompact && styles.compactText,
                textStyle,
              ]}
            >
              {title}
            </Text>
          ) : (
            children
          )}

          {icon && iconPosition === 'right' && (
            <Feather
              name={icon}
              size={iconSize}
              color={textColor}
              style={title ? styles.iconRight : undefined}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadowGlow: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  pillContainer: {
    width: '100%',
    borderRadius: 9999,
  },
  compactContainer: {
    alignSelf: 'flex-start',
    borderRadius: 9999,
  },
  circleContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  aquaBorder: {
    borderWidth: 1.5,
    borderColor: '#221898',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  specularRim: {
    borderTopWidth: 1.2,
    borderLeftWidth: 0.8,
    borderRightWidth: 0.8,
    borderBottomWidth: 0,
    borderTopColor: 'rgba(255, 255, 255, 0.95)',
    borderLeftColor: 'rgba(255, 255, 255, 0.4)',
    borderRightColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomColor: 'transparent',
    borderRadius: 9999,
  },
  pillShape: {
    borderRadius: 9999,
    height: 50,
    paddingHorizontal: 22,
  },
  compactShape: {
    borderRadius: 9999,
    height: 40,
    paddingHorizontal: 18,
  },
  circleShape: {
    width: 34,
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 0,
  },

  // Bottom Turquoise Shade
  pillTurquoiseShade: {
    position: 'absolute',
    bottom: 0.5,
    left: 2,
    right: 2,
    height: '42%',
    borderBottomLeftRadius: 9999,
    borderBottomRightRadius: 9999,
    overflow: 'hidden',
  },
  circleTurquoiseShade: {
    position: 'absolute',
    bottom: 0.5,
    left: 1.5,
    right: 1.5,
    height: '40%',
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
    overflow: 'hidden',
  },

  // Inner Circle 1: Pure white core highlight - wider width!
  pillInnerCircle1: {
    position: 'absolute',
    top: 1.2,
    left: '5%',
    right: '5%',
    height: 15,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  circleInnerCircle1: {
    position: 'absolute',
    top: 1,
    left: 3,
    right: 3,
    height: 11,
    borderRadius: 9999,
    overflow: 'hidden',
  },

  // Inner Circle 2: Mid soft dome
  pillInnerCircle2: {
    position: 'absolute',
    top: 1,
    left: '2.5%',
    right: '2.5%',
    height: 22,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  circleInnerCircle2: {
    position: 'absolute',
    top: 1,
    left: 2,
    right: 2,
    height: 15,
    borderRadius: 9999,
    overflow: 'hidden',
  },

  // Inner Circle 3: Outer top gloss meniscus
  pillInnerCircle3: {
    position: 'absolute',
    top: 1,
    left: 2,
    right: 2,
    height: '48%',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  circleInnerCircle3: {
    position: 'absolute',
    top: 1,
    left: 1.5,
    right: 1.5,
    height: '48%',
    borderRadius: 9999,
    overflow: 'hidden',
  },

  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  buttonText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#000000',
    letterSpacing: -0.2,
    textShadowColor: 'rgba(255, 255, 255, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
  compactText: {
    fontSize: 14,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  disabledContainer: {
    opacity: 0.55,
  },
});
