import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  useColorScheme,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { fonts } from '../theme/typography';
import { ChatInputBox } from '../components/ChatInputBox';
import { PromptChip, PromptChipItem } from '../components/PromptChip';
import { LuminousButton } from '../components/LuminousButton';
import { SidebarDrawer } from '../components/SidebarDrawer';
import {
  generateGeminiResponse,
  ActionCta,
  ChatHistoryMessage,
} from '../services/gemini';

const PROMPT_CHIPS: PromptChipItem[] = [
  {
    id: 'discover-leads',
    title: 'Discover leads',
    subtitle: '14 high-intent accounts',
    prompt: 'Find high-intent B2B accounts hiring for Growth & RevOps with recent Series A/B funding, and generate personalized outbound angles.',
    icon: 'target',
  },
  {
    id: 'draft-outbound',
    title: 'Review outbound',
    subtitle: '3 sequences pending',
    prompt: 'Review the 3 draft cold outreach sequences for VP of Sales prospects and check personalization confidence scores.',
    icon: 'mail',
  },
  {
    id: 'ai-visibility',
    title: 'AI visibility',
    subtitle: 'Weekly GEO benchmark',
    prompt: 'Analyze our visibility and citation share across ChatGPT, Perplexity, and Claude for "best AI growth tools" queries.',
    icon: 'trending-up',
  },
  {
    id: 'campaign-launch',
    title: 'Campaign launch',
    subtitle: 'Executive briefing',
    prompt: 'Prepare an executive briefing for our 2:30 PM Outbound Campaign Launch review with pipeline forecasts and copy variants.',
    icon: 'zap',
  },
];

export const ACCENT_COLOR = '#0F172A';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isStreaming?: boolean;
  actionCta?: ActionCta;
}

export const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollViewRef = useRef<any>(null);

  const handleCopyMessage = (id: string, text: string) => {
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleShareMessage = async (text: string) => {
    try {
      await Share.share({ message: text });
    } catch {
      // ignore
    }
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = typeof overrideText === 'string' ? overrideText : inputText;
    const trimmed = textToSend.trim();
    if (!trimmed || isGenerating) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: trimmed };
    const assistantId = (Date.now() + 1).toString();

    // Snapshot chat history for Gemini conversational context
    const currentHistory: ChatHistoryMessage[] = messages.map((m) => ({
      role: m.role,
      text: m.text,
    }));

    // Add user message and assistant placeholder with thinking state
    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: assistantId,
        role: 'assistant',
        text: '',
        isStreaming: true,
      },
    ]);
    setInputText('');
    setIsGenerating(true);
    Keyboard.dismiss();

    try {
      const responsePayload = await generateGeminiResponse(trimmed, currentHistory);
      const words = responsePayload.text.split(' ');

      let currentIndex = 0;
      let currentAcc = '';

      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          currentAcc += (currentIndex === 0 ? '' : ' ') + words[currentIndex];
          currentIndex++;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, text: currentAcc, isStreaming: true } : m
            )
          );
          scrollViewRef.current?.scrollToEnd({ animated: true });
        } else {
          clearInterval(interval);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, isStreaming: false, actionCta: responsePayload.actionCta }
                : m
            )
          );
          setIsGenerating(false);
        }
      }, 25);
    } catch (err) {
      console.warn('[Chat] Failed to generate response:', err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                text: "I couldn't process that request right now. Please check your internet connection or Gemini API key.",
                isStreaming: false,
              }
            : m
        )
      );
      setIsGenerating(false);
    }
  };

  const handleSelectPrompt = (promptText: string) => {
    handleSend(promptText);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: isDark ? '#0C0D11' : '#FFFFFF' }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.innerContainer}>
          {/* Top Navigation Bar */}
          <View style={styles.topBar}>
            {/* Left: Clean 2-Line Hamburger Menu */}
            <TouchableOpacity
              style={styles.navButton}
              activeOpacity={0.6}
              onPress={() => setIsSidebarOpen(true)}
              accessibilityLabel="Open menu"
              accessibilityRole="button"
            >
              <View style={styles.twoLineMenu}>
                <View
                  style={[
                    styles.menuLine,
                    styles.menuLineTop,
                    { backgroundColor: isDark ? '#F1F5F9' : '#1E293B' },
                  ]}
                />
                <View
                  style={[
                    styles.menuLine,
                    styles.menuLineBottom,
                    { backgroundColor: isDark ? '#F1F5F9' : '#1E293B' },
                  ]}
                />
              </View>
            </TouchableOpacity>

            {/* Right: Single Clean New Chat Button */}
            <TouchableOpacity
              style={styles.navButton}
              activeOpacity={0.6}
              onPress={() => setMessages([])}
              accessibilityLabel="Start new chat"
              accessibilityRole="button"
            >
              <Feather
                name="edit"
                size={20}
                color={isDark ? '#F1F5F9' : '#1E293B'}
              />
            </TouchableOpacity>
          </View>

          {/* Conversation Space */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollArea}
            contentContainerStyle={[
              styles.scrollContent,
              messages.length === 0 && styles.scrollContentEmpty,
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              if (messages.length > 0) {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }
            }}
          >
            {messages.length > 0 && (
              <View style={styles.messagesList}>
                {messages.map((item) => {
                  if (item.role === 'user') {
                    return (
                      <View key={item.id} style={styles.userMessageRow}>
                        <View
                          style={[
                            styles.userBubble,
                            isDark ? styles.userBubbleDark : styles.userBubbleLight,
                          ]}
                        >
                          <Text
                            style={[
                              styles.userText,
                              { color: isDark ? '#F8FAFC' : '#0F172A' },
                            ]}
                          >
                            {item.text}
                          </Text>
                        </View>
                      </View>
                    );
                  }

                  return (
                    <View key={item.id} style={styles.assistantMessageRow}>
                      {item.text.length === 0 && item.isStreaming ? (
                        <View style={styles.thinkingContainer}>
                          <View
                            style={[
                              styles.thinkingDot,
                              { backgroundColor: isDark ? '#818CF8' : '#6366F1' },
                            ]}
                          />
                          <Text
                            style={[
                              styles.thinkingText,
                              { color: isDark ? '#94A3B8' : '#64748B' },
                            ]}
                          >
                            Thinking...
                          </Text>
                        </View>
                      ) : (
                        <Text
                          style={[
                            styles.assistantText,
                            { color: isDark ? '#F1F5F9' : '#0F172A' },
                          ]}
                        >
                          {item.text}
                        </Text>
                      )}

                      {/* Action CTA Button with Luminous inner shadow style */}
                      {!item.isStreaming && item.actionCta && (
                        <View style={styles.assistantCtaWrapper}>
                          <LuminousButton
                            title={item.actionCta.title}
                            icon={item.actionCta.icon as keyof typeof Feather.glyphMap}
                            variant="compact"
                            onPress={() => handleSend(item.actionCta!.prompt)}
                          />
                        </View>
                      )}

                      {/* Action cluster: copy, share, more */}
                      {!item.isStreaming && item.text.length > 0 && (
                        <View style={styles.assistantActionsRow}>
                          <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.actionIconBtn}
                            onPress={() => handleCopyMessage(item.id, item.text)}
                            accessibilityLabel="Copy response"
                          >
                            <Feather
                              name={copiedId === item.id ? 'check' : 'copy'}
                              size={16}
                              color={copiedId === item.id ? (isDark ? '#4ADE80' : '#16A34A') : (isDark ? '#94A3B8' : '#71717A')}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.actionIconBtn}
                            onPress={() => handleShareMessage(item.text)}
                            accessibilityLabel="Share response"
                          >
                            <Feather
                              name="share"
                              size={16}
                              color={isDark ? '#94A3B8' : '#71717A'}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.actionIconBtn}
                            onPress={() => {}}
                            accessibilityLabel="More options"
                          >
                            <Feather
                              name="more-horizontal"
                              size={16}
                              color={isDark ? '#94A3B8' : '#71717A'}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>

          {/* Clean Prompt Chips Carousel when empty */}
          {messages.length === 0 && (
            <View style={styles.promptChipsSection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.promptChipsScrollContent}
                keyboardShouldPersistTaps="handled"
              >
                {PROMPT_CHIPS.map((chip) => (
                  <PromptChip
                    key={chip.id}
                    item={chip}
                    onPress={(item) => handleSelectPrompt(item.prompt)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Bottom Chat Input Box - Floats seamlessly over scrolling messages */}
          <View style={styles.inputWrapper} pointerEvents="box-none">
            <ChatInputBox
              value={inputText}
              onChangeText={setInputText}
              onSubmit={() => handleSend()}
              placeholder={messages.length === 0 ? 'Ask anything' : 'Ask Jam...'}
              showPlus={true}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Full-Screen Sliding Sidebar Navigation */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={() => {
          setMessages([]);
          setInputText('');
        }}
        onSelectHistory={(item) => handleSend(item.title)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  topRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: StyleSheet.hairlineWidth,
  },
  navButtonLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  navButtonDark: {
    backgroundColor: '#1E2028',
    borderColor: '#2D3139',
  },
  twoLineMenu: {
    width: 18,
    height: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  menuLine: {
    height: 2,
    borderRadius: 1,
  },
  menuLineTop: {
    width: 17,
  },
  menuLineBottom: {
    width: 11,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 88,
    justifyContent: 'flex-start',
  },
  scrollContentEmpty: {
    justifyContent: 'flex-end',
    paddingBottom: 76,
    paddingTop: 58,
  },
  messagesList: {
    paddingBottom: 12,
    gap: 18,
  },
  userMessageRow: {
    alignSelf: 'flex-end',
    maxWidth: '82%',
  },
  userBubble: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  userBubbleLight: {
    backgroundColor: '#F2F2F7',
  },
  userBubbleDark: {
    backgroundColor: '#1E2028',
  },
  userText: {
    fontFamily: fonts.regular,
    fontSize: 15.5,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  assistantMessageRow: {
    alignSelf: 'flex-start',
    width: '100%',
  },
  thinkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  thinkingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  thinkingText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    letterSpacing: -0.2,
  },
  assistantText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: -0.2,
  },
  assistantCtaWrapper: {
    marginTop: 14,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  assistantActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 10,
    paddingLeft: 2,
  },
  actionIconBtn: {
    padding: 4,
  },
  promptChipsSection: {
    paddingBottom: 72,
  },
  promptChipsScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 8 : 14,
    paddingTop: 6,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
});
