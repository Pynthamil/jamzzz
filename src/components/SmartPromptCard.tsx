import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { fonts } from '../theme/typography';

export interface SmartPromptItem {
  id: string;
  title: string;
  subtitle: string;
  prompt: string;
  type: 'calendar' | 'emails' | 'tasks' | 'metric';
  data: {
    calendar?: {
      badge: string;
      title: string;
      time: string;
    };
    emails?: Array<{
      sender: string;
      subject?: string;
    }>;
    tasks?: Array<{
      title: string;
    }>;
    metric?: {
      change: string;
      value: string;
      label: string;
    };
  };
}

interface SmartPromptCardProps {
  item: SmartPromptItem;
  onPress: (item: SmartPromptItem) => void;
}

export const SmartPromptCard: React.FC<SmartPromptCardProps> = ({ item, onPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      activeOpacity={0.78}
      onPress={() => onPress(item)}
      style={[
        styles.card,
        isDark ? styles.cardDark : styles.cardLight,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.subtitle}`}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { color: isDark ? '#F8FAFC' : '#111827' },
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: isDark ? '#94A3B8' : '#8E8E93' },
          ]}
          numberOfLines={1}
        >
          {item.subtitle}
        </Text>
      </View>

      {/* Widget Container */}
      <View style={styles.contentArea}>
        {item.type === 'calendar' && item.data.calendar && (
          <View
            style={[
              styles.calendarContainer,
              isDark ? styles.widgetBgDark : styles.widgetBgLight,
            ]}
          >
            <Text
              style={[
                styles.calendarBadge,
                { color: isDark ? '#94A3B8' : '#8E8E93' },
              ]}
            >
              {item.data.calendar.badge}
            </Text>
            <View
              style={[
                styles.calendarBlock,
                {
                  backgroundColor: isDark
                    ? 'rgba(34, 197, 94, 0.16)'
                    : '#DCFCE7',
                },
              ]}
            >
              <View style={styles.calendarStripe} />
              <View style={styles.calendarTextCol}>
                <Text
                  style={[
                    styles.calendarTitle,
                    { color: isDark ? '#F1F5F9' : '#14532D' },
                  ]}
                  numberOfLines={1}
                >
                  {item.data.calendar.title}
                </Text>
                <Text style={styles.calendarTime}>
                  {item.data.calendar.time}
                </Text>
              </View>
            </View>
          </View>
        )}

        {item.type === 'emails' && item.data.emails && (
          <View style={styles.emailsContainer}>
            {item.data.emails.map((email, idx) => (
              <View
                key={idx}
                style={[
                  styles.emailCard,
                  isDark ? styles.emailCardDark : styles.emailCardLight,
                ]}
              >
                <View style={styles.emailTopRow}>
                  <View style={styles.redDot} />
                  <Text
                    style={[
                      styles.emailSender,
                      { color: isDark ? '#F1F5F9' : '#18181B' },
                    ]}
                    numberOfLines={1}
                  >
                    {email.sender}
                  </Text>
                </View>
                {email.subject ? (
                  <Text
                    style={[
                      styles.emailSubject,
                      { color: isDark ? '#94A3B8' : '#71717A' },
                    ]}
                    numberOfLines={1}
                  >
                    {email.subject}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {item.type === 'tasks' && item.data.tasks && (
          <View style={styles.tasksContainer}>
            {item.data.tasks.map((task, idx) => (
              <View
                key={idx}
                style={[
                  styles.taskCard,
                  isDark ? styles.emailCardDark : styles.emailCardLight,
                ]}
              >
                <View style={styles.taskCheckCircle} />
                <Text
                  style={[
                    styles.taskTitle,
                    { color: isDark ? '#F1F5F9' : '#18181B' },
                  ]}
                  numberOfLines={1}
                >
                  {task.title}
                </Text>
              </View>
            ))}
          </View>
        )}

        {item.type === 'metric' && item.data.metric && (
          <View
            style={[
              styles.metricCard,
              isDark ? styles.widgetBgDark : styles.widgetBgLight,
            ]}
          >
            <Text style={styles.metricChange}>
              {item.data.metric.change}
            </Text>
            <Text
              style={[
                styles.metricValue,
                { color: isDark ? '#F1F5F9' : '#18181B' },
              ]}
              numberOfLines={1}
            >
              {item.data.metric.value}
            </Text>
            <Text
              style={[
                styles.metricLabel,
                { color: isDark ? '#94A3B8' : '#71717A' },
              ]}
              numberOfLines={1}
            >
              {item.data.metric.label}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 205,
    height: 205,
    borderRadius: 22,
    padding: 14,
    justifyContent: 'space-between',
  },
  cardLight: {
    backgroundColor: '#F5F5F7',
  },
  cardDark: {
    backgroundColor: '#1A1C24',
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 20,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    fontWeight: '400',
    marginTop: 2,
    letterSpacing: -0.1,
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
  },
  calendarContainer: {
    borderRadius: 14,
    padding: 10,
  },
  widgetBgLight: {
    backgroundColor: '#EBEBF0',
  },
  widgetBgDark: {
    backgroundColor: '#242632',
  },
  calendarBadge: {
    fontFamily: fonts.medium,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  calendarBlock: {
    borderRadius: 8,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  calendarStripe: {
    width: 4,
    backgroundColor: '#16A34A',
  },
  calendarTextCol: {
    paddingVertical: 7,
    paddingHorizontal: 8,
    flex: 1,
  },
  calendarTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  calendarTime: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
    marginTop: 2,
  },
  emailsContainer: {
    gap: 6,
  },
  emailCard: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  emailCardLight: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  emailCardDark: {
    backgroundColor: '#242632',
  },
  emailTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  redDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#EF4444',
  },
  emailSender: {
    fontFamily: fonts.bold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -0.1,
    flex: 1,
  },
  emailSubject: {
    fontFamily: fonts.regular,
    fontSize: 10,
    fontWeight: '400',
    marginLeft: 10,
    marginTop: 1,
  },
  tasksContainer: {
    gap: 6,
  },
  taskCard: {
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  taskCheckCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
  },
  taskTitle: {
    fontFamily: fonts.medium,
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  metricCard: {
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricChange: {
    fontFamily: fonts.bold,
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  metricLabel: {
    fontFamily: fonts.medium,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});
