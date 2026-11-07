import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Ionicons } from '@expo/vector-icons';
import CheckboxWithFilter from './CategoryCheckbox';

type DropdownProps = {
  setFilter: (value: string) => void;
  selectedCategory?: string | null;
};

type Category = {
  name: string;
  _id: string;
};

const GET_CATEGORIES = gql`
  query Categories {
    categories {
      name
      _id
    }
  }
`;

const CategoryFilter: React.FC<DropdownProps> = ({ setFilter, selectedCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { loading, error, data } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text style={styles.headerTitle}>Categories</Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#9ca3af"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.content}>
          {loading && (
            <ActivityIndicator size="small" color="#a855f7" style={styles.loader} />
          )}
          {error && (
            <Text style={styles.errorText}>Failed to load categories</Text>
          )}
          {data?.categories?.map((category: Category) => (
            <CheckboxWithFilter
              key={category._id}
              _id={category._id}
              name={category.name}
              setFilter={setFilter}
              selected={selectedCategory === category._id}
            />
          ))}
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
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  loader: {
    marginVertical: 12,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginVertical: 8,
  },
});

export default CategoryFilter;