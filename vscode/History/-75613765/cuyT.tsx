import { Slot } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
  return (
    <KeyboardAvoidingView>
      <Text>Auth Layout</Text>
      <Slot />
    </SafeAreaView>
  );
}
