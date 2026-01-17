import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, Pressable, Modal, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ConsentItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  enabled: boolean;
  learnMore: string;
}

interface ConsentManagerProps {
  consents: ConsentItem[];
  onToggle: (id: string, value: boolean) => void;
}

export const ConsentManager: React.FC<ConsentManagerProps> = ({ consents, onToggle }) => {
  const [selectedConsent, setSelectedConsent] = useState<ConsentItem | null>(null);
  const [showLearnMore, setShowLearnMore] = useState(false);

  const handleLearnMore = (consent: ConsentItem) => {
    setSelectedConsent(consent);
    setShowLearnMore(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="privacy-tip" size={24} color="#10b981" />
        <Text style={styles.title}>Consent & Permissions</Text>
      </View>

      {consents.map((consent) => (
        <View key={consent.id} style={styles.consentItem}>
          <View style={styles.consentLeft}>
            <View style={styles.iconContainer}>
              <MaterialIcons name={consent.icon} size={24} color="#10b981" />
            </View>
            <View style={styles.consentInfo}>
              <Text style={styles.consentTitle}>{consent.title}</Text>
              <Text style={styles.consentDescription}>{consent.description}</Text>
              <Pressable onPress={() => handleLearnMore(consent)}>
                <Text style={styles.learnMoreLink}>Learn More</Text>
              </Pressable>
            </View>
          </View>
          <Switch
            value={consent.enabled}
            onValueChange={(value) => onToggle(consent.id, value)}
            trackColor={{ false: '#cbd5e1', true: '#10b981' }}
            thumbColor="#fff"
          />
        </View>
      ))}

      {/* Learn More Modal */}
      <Modal
        visible={showLearnMore}
        animationType="slide"
        transparent
        onRequestClose={() => setShowLearnMore(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedConsent?.title}</Text>
              <Pressable onPress={() => setShowLearnMore(false)}>
                <MaterialIcons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>{selectedConsent?.learnMore}</Text>
            </ScrollView>

            <Pressable
              style={styles.modalButton}
              onPress={() => setShowLearnMore(false)}
            >
              <Text style={styles.modalButtonText}>Got it</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  consentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  consentLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  consentInfo: {
    flex: 1,
  },
  consentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  consentDescription: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    lineHeight: 18,
  },
  learnMoreLink: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  modalBody: {
    marginBottom: 16,
  },
  modalText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
