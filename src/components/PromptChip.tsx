import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(item)}
      style={[
        styles.chip,
        isDark ? styles.chipDark : styles.chipLight,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.subtitle}`}
    >
      <Text
        style={[
          styles.title,
          { color: isDark ? '#F8FAFC' : '#0F172A' },
        ]}
        numberOfLines={1}
      >
        {item.title}
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: isDark ? '#94A3B8' : '#71717A' },
        ]}
        numberOfLines={1}
      >
        {item.subtitle}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  chipLight: {
    backgroundColor: '#F4F4F6',
    borderColor: '#E5E7EB',
  },
  chipDark: {
    backgroundColor: '#1E2028',
    borderColor: '#2D3139',
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 2,
    letterSpacing: -0.1,
  },
});
