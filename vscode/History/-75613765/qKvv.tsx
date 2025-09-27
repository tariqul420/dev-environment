import { Slot } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, Text } from 'react-native';

export default function AuthLayout() {
  return (
    <KeyboardAvoidingView behavior={Platform.OS}>
      <Text>Auth Layout</Text>
      <Slot />
    </KeyboardAvoidingView>
  );
}
