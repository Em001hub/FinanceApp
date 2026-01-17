import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { UserProfile, Transaction } from '../services/UserService';
import { TimeUtils } from '../utils/TimeUtils';
import { FinancialUtils } from '../utils/FinancialUtils';

interface ActivityHistoryViewProps {
  userData: UserProfile;
}

type FilterType = 'all' | 'income' | 'expense' | 'investment';
type SortType = 'date' | 'amount' | 'type';

export const ActivityHistoryView: React.FC<ActivityHistoryViewProps> = ({ userData }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Mock extended transaction history
  const [transactions] = useState<Transaction[]>([
    ...userData.transactionHistory,
    {
      id: 'txn_4',
      amount: 2500,
      type: 'expense',
      category: 'groceries',
      date: new Date('2024-01-04'),
      description: 'Monthly grocery shopping at BigBasket'
    },
    {
      id: 'txn_5',
      amount: 8000,
      type: 'expense',
      category: 'utilities',
      date: new Date('2024-01-05'),
      description: 'Electricity and water bill payment'
    },
    {
      id: 'txn_6',
      amount: 12000,
      type: 'investment',
      category: 'stocks',
      date: new Date('2024-01-06'),
      description: 'Investment in HDFC Bank shares'
    },
    {
      id: 'txn_7',
      amount: 3500,
      type: 'expense',
      category: 'entertainment',
      date: new Date('2024-01-07'),
      description: 'Movie tickets and dinner'
    },
    {
      id: 'txn_8',
      amount: 25000,
      type: 'income',
      category: 'freelance',
      date: new Date('2024-01-08'),
      description: 'Freelance project payment'
    },
    {
      id: 'txn_9',
      amount: 1800,
      type: 'expense',
      category: 'transport',
      date: new Date('2024-01-09'),
      description: 'Uber rides and metro card recharge'
    },
    {
      id: 'txn_10',
      amount: 7500,
      type: 'investment',
      category: 'mutual_fund',
      date: new Date('2024-01-10'),
      description: 'Additional SIP investment in equity fund'
    }
  ]);

  const getFilteredAndSortedTransactions = () => {
    let filtered = transactions;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(txn => 
        txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(txn => txn.type === selectedFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.date.getTime() - a.date.getTime();
        case 'amount':
          return b.amount - a.amount;
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income': return 'trending-up';
      case 'expense': return 'trending-down';
      case 'investment': return 'account-balance';
      default: return 'swap-horiz';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'income': return '#10b981';
      case 'expense': return '#ef4444';
      case 'investment': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      salary: 'work',
      freelance: 'computer',
      rent: 'home',
      groceries: 'shopping-cart',
      utilities: 'flash-on',
      entertainment: 'movie',
      transport: 'directions-car',
      mutual_fund: 'trending-up',
      stocks: 'show-chart',
      default: 'category'
    };
    return icons[category] || icons.default;
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isExpanded = expandedItems.has(item.id);
    const transactionColor = getTransactionColor(item.type);

    return (
      <Pressable 
        style={styles.transactionItem}
        onPress={() => toggleExpanded(item.id)}
      >
        <View style={styles.transactionHeader}>
          <View style={[styles.transactionIcon, { backgroundColor: `${transactionColor}20` }]}>
            <MaterialIcons 
              name={getTransactionIcon(item.type) as any} 
              size={20} 
              color={transactionColor} 
            />
          </View>
          
          <View style={styles.transactionContent}>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <View style={styles.transactionMeta}>
              <MaterialIcons 
                name={getCategoryIcon(item.category) as any} 
                size={14} 
                color="#94a3b8" 
              />
              <Text style={styles.transactionCategory}>{item.category}</Text>
              <Text style={styles.transactionDate}>
                {TimeUtils.getRelativeTime(item.date)}
              </Text>
            </View>
          </View>
          
          <View style={styles.transactionAmount}>
            <Text style={[styles.amountText, { color: transactionColor }]}>
              {item.type === 'expense' ? '-' : '+'}
              {FinancialUtils.formatCurrency(item.amount)}
            </Text>
            <MaterialIcons 
              name={isExpanded ? 'expand-less' : 'expand-more'} 
              size={20} 
              color="#94a3b8" 
            />
          </View>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.expandedRow}>
              <Text style={styles.expandedLabel}>Transaction ID:</Text>
              <Text style={styles.expandedValue}>{item.id}</Text>
            </View>
            <View style={styles.expandedRow}>
              <Text style={styles.expandedLabel}>Date:</Text>
              <Text style={styles.expandedValue}>{TimeUtils.formatDate(item.date)}</Text>
            </View>
            <View style={styles.expandedRow}>
              <Text style={styles.expandedLabel}>Category:</Text>
              <Text style={styles.expandedValue}>{item.category}</Text>
            </View>
            <View style={styles.expandedRow}>
              <Text style={styles.expandedLabel}>Type:</Text>
              <Text style={[styles.expandedValue, { color: transactionColor }]}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </Text>
            </View>
          </View>
        )}
      </Pressable>
    );
  };

  const filteredTransactions = getFilteredAndSortedTransactions();

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <MaterialIcons name="clear" size={20} color="#94a3b8" />
          </Pressable>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['all', 'income', 'expense', 'investment'] as FilterType[]).map((filter) => (
          <Pressable
            key={filter}
            style={[
              styles.filterTab,
              selectedFilter === filter && styles.activeFilterTab
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.activeFilterText
            ]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        {(['date', 'amount', 'type'] as SortType[]).map((sort) => (
          <Pressable
            key={sort}
            style={[
              styles.sortOption,
              sortBy === sort && styles.activeSortOption
            ]}
            onPress={() => setSortBy(sort)}
          >
            <Text style={[
              styles.sortText,
              sortBy === sort && styles.activeSortText
            ]}>
              {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Transactions</Text>
          <Text style={styles.summaryValue}>{filteredTransactions.length}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Amount</Text>
          <Text style={styles.summaryValue}>
            {FinancialUtils.formatCurrency(
              filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0)
            )}
          </Text>
        </View>
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        style={styles.transactionList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="receipt" size={48} color="#94a3b8" />
            <Text style={styles.emptyText}>No transactions found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeFilterTab: {
    backgroundColor: '#0f172a',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  activeFilterText: {
    color: '#fff',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginRight: 12,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  activeSortOption: {
    backgroundColor: '#f1f5f9',
  },
  sortText: {
    fontSize: 12,
    color: '#64748b',
  },
  activeSortText: {
    color: '#0f172a',
    fontWeight: '500',
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  transactionList: {
    flex: 1,
  },
  transactionItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionContent: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionCategory: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
    marginRight: 8,
  },
  transactionDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  expandedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  expandedLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  expandedValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0f172a',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});