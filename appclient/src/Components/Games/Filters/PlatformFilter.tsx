import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type DropdownProps = {
  setFilter: (value: string) => void;
  selectedPlatform?: string | null;
};

const PlatformFilter: React.FC<DropdownProps> = ({ setFilter, selectedPlatform }) => {
  const [isOpen, setIsOpen] = useState(false);
  const items = ['PC', 'PS5', 'Xbox', 'Switch'];

  const handleSelect = (item: string) => {
    if (selectedPlatform === item) {
      setFilter('');
    } else {
      setFilter(item);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text style={styles.headerTitle}>Platform</Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#9ca3af"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.content}>
          {items.map((item) => {
            const isSelected = selectedPlatform === item;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.itemButton, isSelected && styles.itemButtonSelected]}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.itemText, isSelected && styles.itemTextSelected]}
                >
                  {item}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={18} color="#a855f7" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 8,
    backgroundColor: '#18181b',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  itemButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginVertical: 2,
  },
  itemButtonSelected: {
    backgroundColor: '#27272a',
  },
  itemText: {
    fontSize: 15,
    color: '#d1d5db',
  },
  itemTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default PlatformFilter;