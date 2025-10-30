import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { AISupportChat } from '../src/components/AISupportChat';
import { useRouter } from 'expo-router';

export default function AISupportScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <AISupportChat visible={true} onClose={() => router.back()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
