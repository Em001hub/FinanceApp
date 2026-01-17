import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { UserProfile } from '../services/UserService';
import { SecurityDetailsView } from './SecurityDetailsView';
import { CreditEducationView } from './CreditEducationView';
import { ActivityHistoryView } from './ActivityHistoryView';

export interface DetailedViewModalProps {
  type: 'security' | 'credit' | 'activity' | 'risk' | 'investment';
  visible: boolean;
  onClose: () => void;
  userData: UserProfile;
}

export const DetailedViewModal: React.FC<DetailedViewModalProps> = ({
  type,
  visible,
  onClose,
  userData,
}) => {
  const { t } = useTranslation();

  const getTitle = (): string => {
    switch (type) {
      case 'security':
        return t('security.details.title');
      case 'credit':
        return t('credit.education.title');
      case 'activity':
        return t('activity.history.title');
      case 'risk':
        return t('risk.profile.title');
      case 'investment':
        return t('investment.guidance.title');
      default:
        return 'Details';
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'security':
        return <SecurityDetailsView userData={userData} />;
      case 'credit':
        return <CreditEducationView userData={userData} />;
      case 'activity':
        return <ActivityHistoryView userData={userData} />;
      case 'risk':
        return <View><Text>Risk Profile Details Coming Soon</Text></View>;
      case 'investment':
        return <View><Text>Investment Guidance Coming Soon</Text></View>;
      default:
        return <View><Text>Content not available</Text></View>;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{getTitle()}</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#64748b" />
          </Pressable>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});