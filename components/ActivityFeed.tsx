import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export interface ActivityEvent {
  id: string;
  type: 'fraud' | 'loan' | 'credit' | 'compliance';
  title: string;
  description: string;
  timestamp: Date;
}

interface ActivityFeedProps {
  events: ActivityEvent[];
  maxItems?: number;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ events, maxItems = 10 }) => {
  const displayEvents = events.slice(0, maxItems);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'fraud':
        return 'error-outline';
      case 'loan':
        return 'account-balance-wallet';
      case 'credit':
        return 'trending-up';
      case 'compliance':
        return 'verified-user';
      default:
        return 'info';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'fraud':
        return '#ef4444';
      case 'loan':
        return '#10b981';
      case 'credit':
        return '#3b82f6';
      case 'compliance':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getEventBgColor = (type: string) => {
    switch (type) {
      case 'fraud':
        return '#fef2f2';
      case 'loan':
        return '#f0fdf4';
      case 'credit':
        return '#eff6ff';
      case 'compliance':
        return '#fffbeb';
      default:
        return '#f9fafb';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity Feed</Text>
        <Pressable>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

      {displayEvents.map((event) => (
        <View key={event.id} style={styles.eventCard}>
          <View style={[styles.eventIcon, { backgroundColor: getEventBgColor(event.type) }]}>
            <MaterialIcons
              name={getEventIcon(event.type) as any}
              size={20}
              color={getEventColor(event.type)}
            />
          </View>
          <View style={styles.eventContent}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventTime}>{formatTimestamp(event.timestamp)}</Text>
            </View>
            <Text style={styles.eventDescription}>{event.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    letterSpacing: -0.5,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '500',
    color: '#059669',
  },
  eventCard: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  eventTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginRight: 8,
  },
  eventTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  eventDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
});
