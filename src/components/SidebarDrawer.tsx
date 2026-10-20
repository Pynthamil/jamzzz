import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  Modal,
  Platform,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { fonts } from '../theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface HistoryItem {
  id: string;
  title: string;
}

const TOP_ACTIONS = [
  { id: 'new-chat', label: 'New chat', icon: 'edit' as const },
  { id: 'scheduled', label: 'Scheduled', icon: 'clock' as const },
  { id: 'library', label: 'Library', icon: 'book-open' as const },
  { id: 'plugins', label: 'Plugins', icon: 'disc' as const },
  { id: 'codex', label: 'Codex', icon: 'code' as const },
  { id: 'explore', label: 'Explore', icon: 'more-horizontal' as const },
];

// Kept to 3 items as requested
const PINNED_HISTORY: HistoryItem[] = [
  { id: '1', title: 'SwiftUI Button Fix' },
  { id: '2', title: 'Marketing ORCA Growth' },
  { id: '3', title: 'Choose Portfolio Case Study' },
];

export interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectHistory: (item: HistoryItem) => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  onNewChat,
  onSelectHistory,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, animValue]);

  // Full screen slide from left
  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, 0],
  });

  const backdropOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.45],
  });

  // Calculate safe top padding so header never collides with status bar / dynamic island
  const safeTopPadding = Math.max(insets.top, Platform.OS === 'ios' ? 44 : 24) + 8;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        {/* Semi-transparent Dimmed Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: backdropOpacity },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
            accessibilityLabel="Close sidebar"
          />
        </Animated.View>

        {/* Sliding Full-Width Sidebar Drawer */}
        <Animated.View
          style={[
            styles.drawer,
            {
              width: SCREEN_WIDTH,
              backgroundColor: isDark ? '#14161E' : '#FFFFFF',
              transform: [{ translateX }],
            },
          ]}
        >
          <View style={[styles.innerContent, { paddingTop: safeTopPadding, paddingBottom: Math.max(insets.bottom, 16) }]}>
            {/* Header: App Title + Search & Toggle icons */}
            <View style={styles.header}>
              <Text
                style={[
                  styles.headerTitle,
                  { color: isDark ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                Jam
              </Text>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.headerIconBtn}
                  activeOpacity={0.65}
                  onPress={() => {}}
                  accessibilityLabel="Search"
                >
                  <Feather
                    name="search"
                    size={22}
                    color={isDark ? '#94A3B8' : '#64748B'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.headerIconBtn}
                  activeOpacity={0.65}
                  onPress={onClose}
                  accessibilityLabel="Close sidebar"
                >
                  <Feather
                    name="sidebar"
                    size={22}
                    color={isDark ? '#94A3B8' : '#64748B'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Scrollable Action Items & Pinned History */}
            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Primary Actions List */}
              <View style={styles.topActionsGroup}>
                {TOP_ACTIONS.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.actionRow}
                    activeOpacity={0.65}
                    onPress={() => {
                      if (action.id === 'new-chat') {
                        onNewChat();
                        onClose();
                      }
                    }}
                  >
                    <Feather
                      name={action.icon}
                      size={20}
                      color={isDark ? '#F1F5F9' : '#1E293B'}
                      style={styles.actionIcon}
                    />
                    <Text
                      style={[
                        styles.actionLabel,
                        { color: isDark ? '#F1F5F9' : '#1E293B' },
                      ]}
                    >
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Pinned Section Divider */}
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionHeaderText,
                    { color: isDark ? '#64748B' : '#94A3B8' },
                  ]}
                >
                  Pinned
                </Text>
              </View>

              {/* Pinned History List (Only 2-3 items) */}
              <View style={styles.historyList}>
                {PINNED_HISTORY.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyRow}
                    activeOpacity={0.65}
                    onPress={() => {
                      onSelectHistory(item);
                      onClose();
                    }}
                  >
                    <Text
                      style={[
                        styles.historyTitle,
                        { color: isDark ? '#CBD5E1' : '#334155' },
                      ]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Bottom Footer User Row */}
            <View
              style={[
                styles.userFooter,
                { borderTopColor: isDark ? '#1E222D' : '#F1F5F9' },
              ]}
            >
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>J</Text>
              </View>
              <View style={styles.userInfo}>
                <Text
                  style={[
                    styles.userName,
                    { color: isDark ? '#F8FAFC' : '#0F172A' },
                  ]}
                  numberOfLines={1}
                >
                  Jam Workspace
                </Text>
                <Text
                  style={[
                    styles.userPlan,
                    { color: isDark ? '#94A3B8' : '#64748B' },
                  ]}
                >
                  Pro Plan
                </Text>
              </View>
              <Feather
                name="settings"
                size={18}
                color={isDark ? '#64748B' : '#94A3B8'}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    position: 'relative',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
  },
  drawer: {
    height: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 16,
  },
  innerContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    letterSpacing: -0.4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIconBtn: {
    padding: 6,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  topActionsGroup: {
    paddingTop: 8,
    gap: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  actionIcon: {
    marginRight: 16,
    width: 24,
  },
  actionLabel: {
    fontFamily: fonts.medium,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  sectionHeaderText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    letterSpacing: -0.1,
  },
  historyList: {
    gap: 4,
  },
  historyRow: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  historyTitle: {
    fontFamily: fonts.regular,
    fontSize: 15.5,
    letterSpacing: -0.2,
  },
  userFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: fonts.semiBold,
    fontSize: 14.5,
    letterSpacing: -0.2,
  },
  userPlan: {
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 1,
  },
});
