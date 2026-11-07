import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';

type PriceProps = {
  setPrice: (value: number | null) => void;
  currentPrice?: number | null;
};

const PriceSlider: React.FC<PriceProps> = ({ setPrice, currentPrice }) => {
  const [value, setValue] = useState<number>(currentPrice ?? 100);

  useEffect(() => {
    if (currentPrice !== undefined) {
      setValue(currentPrice ?? 100);
    }
  }, [currentPrice]);

  const handleValueChange = (val: number) => {
    const rounded = Math.round(val);
    setValue(rounded);
  };

  const handleSlidingComplete = (val: number) => {
    const rounded = Math.round(val);
    setValue(rounded);
    setPrice(rounded === 100 ? null : rounded);
  };

  const handleReset = () => {
    setValue(100);
    setPrice(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Max Price</Text>
        <Text style={styles.valueText}>
          {value === 0 ? 'Free' : value === 100 ? 'Any ($100)' : `$${value}`}
        </Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={5}
        value={value}
        onValueChange={handleValueChange}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor="#a855f7"
        maximumTrackTintColor="#3f3f46"
        thumbTintColor="#a855f7"
      />

      {value !== 100 && (
        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <Text style={styles.resetText}>Reset price filter</Text>
        </TouchableOpacity>
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  valueText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#a855f7',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  resetButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  resetText: {
    color: '#9ca3af',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});

export default PriceSlider;
