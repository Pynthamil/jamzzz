import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  useColorScheme,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { fonts } from '../theme/typography';

export interface ChatInputBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  onPressPlus?: () => void;
  onPressMic?: () => void;
  onSubmit?: () => void;
  placeholder?: string;
  accentColor?: string;
  showPlus?: boolean;
}

export const ChatInputBox: React.FC<ChatInputBoxProps> = ({
  value,
  onChangeText,
  onPressPlus = () => {},
  onPressMic = () => {},
  onSubmit = () => {},
  placeholder = 'Ask anything',
  showPlus = true,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const hasContent = value.trim().length > 0;
  const cursorColor = isDark ? '#FFFFFF' : '#0F172A';
  const iconColor = isDark ? '#94A3B8' : '#71717A';

  return (
    <View style={styles.container}>
      {/* Clean Minimal Capsule Text Input Pill */}
      <View
        style={[
          styles.pillWrapper,
          isDark ? styles.glassDark : styles.glassLight,
        ]}
      >
        {/* Inline Plus Button inside the pill */}
        {showPlus && (
          <TouchableOpacity
            style={styles.plusButton}
            activeOpacity={0.65}
            onPress={onPressPlus}
            accessibilityLabel="Add attachment"
            accessibilityRole="button"
          >
            <Feather
              name="plus"
              size={20}
              color={iconColor}
            />
          </TouchableOpacity>
        )}

        {/* Text Input */}
        <TextInput
          style={[
            styles.input,
            { color: isDark ? '#F8FAFC' : '#18181B' },
            !showPlus && styles.inputNoPlus,
          ]}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#71717A' : '#8E8E93'}
          value={value}
          onChangeText={onChangeText}
          multiline={false}
          returnKeyType="send"
          onSubmitEditing={() => onSubmit()}
          selectionColor={cursorColor}
          autoCapitalize="sentences"
          autoCorrect={true}
          editable={true}
        />

        {/* Right Action: Clean Minimal Send Button or Mic */}
        {hasContent ? (
          <View style={styles.sendButtonWrapper}>
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
              onPress={() => onSubmit()}
              activeOpacity={0.8}
              accessibilityLabel="Send message"
              accessibilityRole="button"
            >
              <Feather
                name="arrow-up"
                size={16}
                color={isDark ? '#0F172A' : '#FFFFFF'}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={onPressMic}
            style={styles.micButton}
            accessibilityLabel="Voice input"
          >
            <Feather
              name="mic"
              size={19}
              color={iconColor}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  pillWrapper: {
    width: '100%',
    height: 52,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    borderWidth: 1,
  },
  glassDark: {
    backgroundColor: '#1C1D22',
    borderColor: '#2D3139',
  },
  glassLight: {
    backgroundColor: '#F2F2F7',
    borderColor: '#E5E7EB',
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontFamily: fonts.regular,
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: 8,
    height: '100%',
    letterSpacing: -0.2,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
  },
  inputNoPlus: {
    paddingLeft: 16,
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonWrapper: {
    marginRight: 4,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
