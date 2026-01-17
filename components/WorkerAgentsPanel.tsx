import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type AgentStatus = 'idle' | 'working' | 'complete' | 'failed';

export interface WorkerAgent {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  status: AgentStatus;
  progress?: number;
  estimatedTime?: string;
}

interface WorkerAgentsPanelProps {
  agents: WorkerAgent[];
}

export const WorkerAgentsPanel: React.FC<WorkerAgentsPanelProps> = ({ agents }) => {
  const getStatusConfig = (status: AgentStatus) => {
    switch (status) {
      case 'idle':
        return { color: '#94a3b8', bgColor: '#f8f9fa', text: 'Idle' };
      case 'working':
        return { color: '#3b82f6', bgColor: '#eff6ff', text: 'Working' };
      case 'complete':
        return { color: '#10b981', bgColor: '#f0fdf4', text: 'Complete' };
      case 'failed':
        return { color: '#ef4444', bgColor: '#fef2f2', text: 'Failed' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="psychology" size={24} color="#10b981" />
        <Text style={styles.title}>AI Worker Agents</Text>
      </View>

      <ScrollView style={styles.agentsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.agentsGrid}>
          {agents.map((agent) => {
            const statusConfig = getStatusConfig(agent.status);

            return (
              <View key={agent.id} style={styles.agentCard}>
                <View style={[styles.agentIconContainer, { backgroundColor: statusConfig.bgColor }]}>
                  <MaterialIcons name={agent.icon} size={28} color={statusConfig.color} />
                </View>

                <Text style={styles.agentName}>{agent.name}</Text>

                <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                  <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
                  <Text style={[styles.statusText, { color: statusConfig.color }]}>
                    {statusConfig.text}
                  </Text>
                </View>

                {agent.status === 'working' && agent.progress !== undefined && (
                  <>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${agent.progress}%`,
                            backgroundColor: statusConfig.color,
                          },
                        ]}
                      />
                    </View>
                    {agent.estimatedTime && (
                      <Text style={styles.estimatedTime}>{agent.estimatedTime}</Text>
                    )}
                  </>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
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
  agentsContainer: {
    maxHeight: 400,
  },
  agentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  agentCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  agentIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  agentName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  estimatedTime: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
});
