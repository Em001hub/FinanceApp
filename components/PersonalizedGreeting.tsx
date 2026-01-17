import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TimeUtils } from '../utils/TimeUtils';
import { userService } from '../services/UserService';

interface PersonalizedGreetingProps {
  userName?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
  style?: any;
  subtitleStyle?: any;
}

export const PersonalizedGreeting: React.FC<PersonalizedGreetingProps> = ({
  userName: propUserName,
  timeOfDay: propTimeOfDay,
  style,
  subtitleStyle
}) => {
  const { t } = useTranslation();
  const [userName, setUserName] = useState<string | null>(propUserName || null);
  
  useEffect(() => {
    if (!propUserName) {
      loadUserName();
    }
  }, [propUserName]);

  const loadUserName = async () => {
    try {
      const name = await userService.getUserName();
      setUserName(name);
    } catch (error) {
      console.error('Failed to load user name:', error);
    }
  };

  const getGreeting = (): string => {
    const timeOfDay = propTimeOfDay || TimeUtils.getTimeOfDay();
    const greetingKey = `greeting.${timeOfDay}`;
    const baseGreeting = t(greetingKey);
    
    if (userName) {
      return `${baseGreeting} ${userName}`;
    }
    
    return baseGreeting;
  };

  const getSubtitle = (): string => {
    return t('greeting.subtitle');
  };

  return (
    <View>
      <Text style={[styles.greeting, style]}>
        {getGreeting()}
      </Text>
      <Text style={[styles.subGreeting, subtitleStyle]}>
        {getSubtitle()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '400',
  },
});