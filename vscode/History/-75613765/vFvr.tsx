import { Slot } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';

export default function AuthLayout() {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView className="bg-white h-full"></ScrollView>
    </KeyboardAvoidingView>
  );
}
