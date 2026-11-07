import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ErrorPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>An unexpected error occurred</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#991b1b',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default ErrorPage;
