import { images } from '@/constants';
import React from 'react';
import { Dimensions, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

export default function AuthLayout() {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView className="bg-white h-full" keyboardShouldPersistTaps="handled">
        <View className="h-full relative" style={{ height: Dimensions.get('screen').height / 2.25 }}>
          <ImageBackground source={images.loginGraphic} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
