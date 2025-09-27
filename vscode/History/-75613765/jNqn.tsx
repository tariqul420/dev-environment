import { Slot } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Text } from 'react-native';

export default function AuthLayout() {
  return (
    <KeyboardAvoidingView>
      <Text>Auth Layout</Text>
      <Slot />
    </KeyboardAvoidingView>
  );
}
