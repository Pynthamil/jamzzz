import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '../theme/typography';

export interface RetroUserBubbleProps {
  text: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const RetroUserBubble: React.FC<RetroUserBubbleProps> = ({
  text,
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.shadowWrapper, style]}>
      {/* Clean Box Container (Evenly rounded corners, exactly matched to iOS SMS) */}
      <View style={styles.bubbleContainer}>
        {/* Layer 1: Seamless iOS SMS Green Gradient Colorpicked directly from Screenshot */}
        <LinearGradient
          colors={['#D1E9D1', '#AADE70', '#91D33E', '#91D33E', '#97D542', '#BDED75']}
          locations={[0, 0.12, 0.22, 0.74, 0.88, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Layer 2: Subtle Inset Top Specular Rim */}
        <View pointerEvents="none" style={styles.specularRim} />

        {/* Layer 3: Crisp Text with 1px Etched Shadow (0 blur radius for maximum clarity) */}
        <Text style={[styles.text, textStyle]}>
          {text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    alignSelf: 'flex-end',
    maxWidth: '82%',
    shadowColor: '#3F6E18',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  bubbleContainer: {
    position: 'relative',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#3B7016',
    overflow: 'hidden',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  specularRim: {
    ...StyleSheet.absoluteFill,
    borderRadius: 17,
    borderTopWidth: 1.1,
    borderLeftWidth: 0.6,
    borderRightWidth: 0.6,
    borderBottomWidth: 0,
    borderTopColor: 'rgba(255, 255, 255, 0.72)',
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'transparent',
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: 15.5,
    lineHeight: 22,
    color: '#000000',
    letterSpacing: -0.2,
    textShadowColor: 'rgba(255, 255, 255, 0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
    zIndex: 2,
  },
});
