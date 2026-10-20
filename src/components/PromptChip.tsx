import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { fonts } from '../theme/typography';

export interface PromptChipItem {
  id: string;
  title: string;
  subtitle: string;
  prompt: string;
  icon?: keyof typeof Feather.glyphMap;
}

interface PromptChipProps {
  item: PromptChipItem;
  onPress: (item: PromptChipItem) => void;
}

export const PromptChip: React.FC<PromptChipProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.78}
      onPress={() => onPress(item)}
      style={styles.shadowGlow}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.subtitle}`}
    >
      {/* Retro Silver Button Container */}
      <View style={styles.retroBorder}>
        {/* Layer 1: Base Silver Gradient Colorpicked from classic iOS button */}
        <LinearGradient
          colors={['#FFFFFF', '#EEF2F8', '#D6DEE9', '#DFE5EF']}
          locations={[0, 0.45, 0.75, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Layer 2: Bottom Silver Reflective Rim */}
        <View pointerEvents="none" style={styles.bottomReflection}>
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.0)',
              'rgba(235, 242, 252, 0.4)',
              'rgba(250, 253, 255, 0.8)',
            ]}
            locations={[0, 0.5, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Layer 3: Inner Circle 3 (Outer Gloss Meniscus - Top Half) */}
        <View pointerEvents="none" style={styles.innerCircle3}>
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.85)',
              'rgba(230, 238, 248, 0.35)',
              'rgba(200, 215, 235, 0.0)',
            ]}
            locations={[0, 0.52, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Layer 4: Inner Circle 2 (Mid Soft Dome Aura) */}
        <View pointerEvents="none" style={styles.innerCircle2}>
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.92)',
              'rgba(242, 247, 255, 0.65)',
              'rgba(215, 228, 245, 0.0)',
            ]}
            locations={[0, 0.48, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Layer 5: Inner Circle 1 (Innermost Pure White Core Highlight) */}
        <View pointerEvents="none" style={styles.innerCircle1}>
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
        <View pointerEvents="none" style={styles.specularRim} />

        {/* Layer 7: Content (Title + Subtitle) with Etched 1px White Shadow */}
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadowGlow: {
    shadowColor: '#788292',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 4,
    borderRadius: 12,
  },
  retroBorder: {
    borderWidth: 1.2,
    borderColor: '#8A93A2',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  bottomReflection: {
    position: 'absolute',
    bottom: 0.5,
    left: 2,
    right: 2,
    height: '42%',
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
    overflow: 'hidden',
  },
  innerCircle3: {
    position: 'absolute',
    top: 1,
    left: 2,
    right: 2,
    height: '48%',
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    overflow: 'hidden',
  },
  innerCircle2: {
    position: 'absolute',
    top: 1,
    left: '3%',
    right: '3%',
    height: 18,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  innerCircle1: {
    position: 'absolute',
    top: 1.2,
    left: '6%',
    right: '6%',
    height: 12,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  specularRim: {
    ...StyleSheet.absoluteFill,
    borderRadius: 11,
    borderTopWidth: 1.2,
    borderLeftWidth: 0.7,
    borderRightWidth: 0.7,
    borderBottomWidth: 0,
    borderTopColor: 'rgba(255, 255, 255, 0.98)',
    borderLeftColor: 'rgba(255, 255, 255, 0.45)',
    borderRightColor: 'rgba(255, 255, 255, 0.45)',
    borderBottomColor: 'transparent',
  },
  contentContainer: {
    zIndex: 2,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 14.5,
    color: '#111620',
    letterSpacing: -0.2,
    textShadowColor: 'rgba(255, 255, 255, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: '#4B5565',
    marginTop: 1.5,
    letterSpacing: -0.1,
    textShadowColor: 'rgba(255, 255, 255, 0.65)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
});
