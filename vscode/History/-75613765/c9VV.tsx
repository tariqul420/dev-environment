import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

export default function AuthLayout() {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView className="bg-white h-full" keyboardShouldPersistTaps="handled">
        <View className="h-full relative"></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
