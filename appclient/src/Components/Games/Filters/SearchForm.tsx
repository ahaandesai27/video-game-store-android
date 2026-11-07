import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SearchProps = {
  setSearch: (value: string) => void;
  initialValue?: string | null;
};

const SearchForm: React.FC<SearchProps> = ({ setSearch, initialValue }) => {
  const [text, setText] = useState(initialValue || '');

  useEffect(() => {
    if (initialValue !== undefined) {
      setText(initialValue || '');
    }
  }, [initialValue]);

  const handleSearch = () => {
    setSearch(text.trim());
  };

  const handleClear = () => {
    setText('');
    setSearch('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Ionicons name="search" size={18} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Search game..."
          placeholderTextColor="#71717a"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {text.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearIcon}>
            <Ionicons name="close-circle" size={18} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleSearch}
        activeOpacity={0.8}
      >
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    height: '100%',
    padding: 0,
  },
  clearIcon: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: '#9333ea',
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default SearchForm;