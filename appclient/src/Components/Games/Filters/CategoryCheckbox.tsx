import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  _id: string;
  name: string;
  setFilter: (value: string) => void;
  selected?: boolean;
};

const CheckboxWithFilter: React.FC<Props> = ({ _id, name, setFilter, selected }) => {
  const [isChecked, setIsChecked] = useState(false);
  const active = selected !== undefined ? selected : isChecked;

  const handleToggle = () => {
    const nextVal = !active;
    setIsChecked(nextVal);
    if (nextVal) {
      setFilter(_id);
    } else {
      setFilter('');
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      <Ionicons
        name={active ? 'checkbox' : 'square-outline'}
        size={20}
        color={active ? '#a855f7' : '#9ca3af'}
        style={styles.icon}
      />
      <Text style={[styles.label, active && styles.labelChecked]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    color: '#d1d5db',
    fontSize: 15,
  },
  labelChecked: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default CheckboxWithFilter;
