import { Slot } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, Text } from 'react-native';

export default function AuthLayout() {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text>Auth Layout</Text>
      <Slot />
    </KeyboardAvoidingView>
  );
}
