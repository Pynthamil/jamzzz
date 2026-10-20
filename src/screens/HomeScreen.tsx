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
  actionCta?: {
    title: string;
    icon?: keyof typeof Feather.glyphMap;
    prompt: string;
  };
}

interface AiResponsePayload {
  text: string;
  actionCta?: {
    title: string;
    icon?: keyof typeof Feather.glyphMap;
    prompt: string;
  };
}

const getAiResponse = (prompt: string): AiResponsePayload => {
  const lower = prompt.toLowerCase().trim();
  if (lower === 'hello' || lower === 'hi' || lower === 'hey' || lower.startsWith('hello') || lower.startsWith('hey')) {
    return {
      text: "Hey! Ready to accelerate your growth pipeline. What campaign or accounts should we focus on today?",
      actionCta: {
        title: 'Discover leads',
        icon: 'search',
        prompt: 'Find high-intent B2B accounts hiring for Growth & RevOps with recent Series A/B funding, and generate personalized outbound angles.',
      },
    };
  }
  if (lower.startsWith('enrich these 14 accounts') || lower.startsWith('enrich these accounts')) {
    return {
      text: "Enriched contacts and generated tailored 3-touch sequences for Acme AI, Vektor Data, and Northstar Cloud!\n\n• Verified Work Emails: 100% deliverable via ZeroBounce.\n• First Email Hook: Signal-aligned trigger based on their Q4 job postings.\n• Multi-touch schedule: Email + LinkedIn Connection nudge spaced 3 business days.\n\nEverything is staged in your Outbound Sequences queue.",
      actionCta: {
        title: 'Approve & launch sequences',
        icon: 'zap',
        prompt: 'Approve and queue all 3 draft sequences for sending',
      },
    };
  }
  if (lower.startsWith('approve and queue')) {
    return {
      text: "Campaign approved!\n\nAll 3 cold outreach sequences are scheduled in the sending pipeline.\n• Warmup stagger: 25 emails / day / domain.\n• Target time: 8:45 AM local recipient time.\n• Tracking: Real-time reply tracking and sentiment classification enabled.",
    };
  }
  if (lower.includes('lead') || lower.includes('discover') || lower.includes('intent') || lower.includes('acme') || lower.includes('vektor') || lower.includes('prospect')) {
    return {
      text: "Identified 14 high-intent B2B accounts matching your ICP (Series A/B, active RevOps/Growth hiring):\n\n1. Acme AI (Series B · $24M)\n   • Trigger: 4 new SDR openings posted 2 days ago.\n   • Outbound Angle: Accelerating rep ramp time with automated account research.\n   • Primary Contact: David Chen (Head of Sales Development).\n\n2. Vektor Data (Series A · $9M)\n   • Trigger: Migrating CRM stack to Salesforce.\n   • Outbound Angle: Zero-leakage pipeline syncing and real-time lead enrichment.\n   • Primary Contact: Sarah Jenkins (VP Growth).\n\n3. Northstar Cloud (Growth Stage)\n   • Trigger: 3x web traffic spike on comparison pages.\n   • Outbound Angle: Deanonymizing high-intent accounts with instant outbound.\n\nWould you like me to enrich these contacts and draft tailored initial outreach sequences?",
      actionCta: {
        title: 'Enrich & draft outreach',
        icon: 'plus-circle',
        prompt: 'Enrich these 14 accounts and generate initial outreach sequences',
      },
    };
  }
  if (lower.includes('draft') || lower.includes('outbound') || lower.includes('email') || lower.includes('sequence') || lower.includes('sarah') || lower.includes('marcus') || lower.includes('elena')) {
    return {
      text: "Here is the audit for your 3 pending cold outreach drafts:\n\n1. Sarah Lin (VP Growth @ ScaleCorp)\n   • Personalization Score: 96%\n   • Hook: Congratulated on their recent SOC-2 compliance milestone.\n   • CTA: 15-minute workflow audit on AI outbound enrichment.\n\n2. Marcus Vance (Head of RevOps @ DataSphere)\n   • Personalization Score: 92%\n   • Hook: Referenced their podcast discussion on tool consolidation.\n   • CTA: 2-minute interactive demo link.\n\n3. Elena Rostova (VP Sales @ Synthetix)\n   • Personalization Score: 89%\n   • Hook: Addressed their recent European expansion announcement.\n   • CTA: Benchmark report on outbound deliverability across EMEA.\n\nAll deliverability checks passed (DKIM/SPF verified, 0% spam risk). Ready to approve and queue for sending?",
      actionCta: {
        title: 'Approve & queue campaign',
        icon: 'check-circle',
        prompt: 'Approve and queue all 3 draft sequences for sending',
      },
    };
  }
  if (lower.includes('visibility') || lower.includes('perplexity') || lower.includes('search') || lower.includes('geo') || lower.includes('citation') || lower.includes('metric')) {
    return {
      text: "AI Search Visibility & GEO Benchmark (Last 7 Days):\n\n• Perplexity AI: Ranked #1 for 'best AI growth tools' and 'automated outbound platforms' (82% citation frequency).\n• ChatGPT Search: Featured in top 3 recommended solutions for B2B pipeline generation (+24% MoM citation presence).\n• Claude: Cited 18 times as the leading companion for growth operators.\n\nKey Win: Our programmatic comparison guides now drive 43% of generative search referral traffic.\n\nRecommendation: Publish our new case studies to capture rising search queries around 'autonomous SDR workflows'.",
      actionCta: {
        title: 'Generate comparison guide',
        icon: 'file-text',
        prompt: 'Draft programmatic comparison guide for autonomous SDR agents',
      },
    };
  }
  if (lower.includes('campaign') || lower.includes('launch') || lower.includes('briefing') || lower.includes('q4') || lower.includes('calendar') || lower.includes('sync')) {
    return {
      text: "Executive Briefing prepared for the 2:30 PM Q4 Outbound Launch Review:\n\n1. Target Audience: 450 verified Tier-1 accounts across North America & EMEA.\n2. Segment Performance Test:\n   • Variant A (Pain-point specific): Projected 8.4% reply rate.\n   • Variant B (Signal-triggered hiring hook): Projected 12.1% reply rate.\n3. Domain Health: 12 secondary sending domains verified, inbox warmup optimal.\n4. Expected Pipeline: $320k - $480k qualified pipeline within 30 days.\n\nAll sequence variants and the approval queue are synchronized. Would you like me to open the review items?",
      actionCta: {
        title: 'Open approval queue',
        icon: 'arrow-right',
        prompt: 'Open campaign approvals and final checklist',
      },
    };
  }
  if (lower.includes('latency') || lower.includes('edge')) {
    return {
      text: "Looking at global edge metrics across APAC, EMEA, and LATAM:\n\n1. APAC (Tokyo, Singapore): P95 edge latency is at 42ms with an 89.4% cache hit ratio.\n2. EMEA (Frankfurt, London): P95 is 28ms, optimal Anycast routing.\n3. LATAM (São Paulo): Seeing a 78ms spike due to cross-border peering.\n\nRecommendation: Deploy edge warmers in São Paulo and configure geo-DNS failover to cut LATAM latency by ~34%.",
    };
  }
  return {
    text: `I have analyzed your request regarding "${prompt}". All pipeline models, enriched accounts, and campaign signals look optimal. Let me know what specific step you'd like to take next!`,
    actionCta: {
      title: 'Run pipeline diagnostic',
      icon: 'activity',
      prompt: 'Run deep diagnostic on pipeline conversion rates',
    },
  };
};

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

  const handleSend = (overrideText?: string) => {
    const textToSend = typeof overrideText === 'string' ? overrideText : inputText;
    const trimmed = textToSend.trim();
    if (!trimmed || isGenerating) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    Keyboard.dismiss();

    const responsePayload = getAiResponse(trimmed);
    const words = responsePayload.text.split(' ');
    const assistantId = (Date.now() + 1).toString();
    setIsGenerating(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          text: '',
          isStreaming: true,
          actionCta: responsePayload.actionCta,
        },
      ]);

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
              m.id === assistantId ? { ...m, isStreaming: false } : m
            )
          );
          setIsGenerating(false);
        }
      }, 35);
    }, 280);
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
                      <Text
                        style={[
                          styles.assistantText,
                          { color: isDark ? '#F1F5F9' : '#0F172A' },
                        ]}
                      >
                        {item.text}
                      </Text>

                      {/* Action CTA Button with Luminous inner shadow style */}
                      {!item.isStreaming && item.actionCta && (
                        <View style={styles.assistantCtaWrapper}>
                          <LuminousButton
                            title={item.actionCta.title}
                            icon={item.actionCta.icon}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
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
    paddingTop: 16,
    paddingBottom: 88,
    justifyContent: 'flex-start',
  },
  scrollContentEmpty: {
    justifyContent: 'flex-end',
    paddingBottom: 76,
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
    borderRadius: 20,
    borderWidth: 1,
  },
  userBubbleLight: {
    backgroundColor: '#F2F2F7',
    borderColor: '#E5E7EB',
  },
  userBubbleDark: {
    backgroundColor: '#1E2028',
    borderColor: '#2D3139',
  },
  userText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: -0.2,
  },
  assistantMessageRow: {
    alignSelf: 'flex-start',
    width: '100%',
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
