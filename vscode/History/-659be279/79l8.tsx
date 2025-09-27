import CustomButton from '@/components/custom-button';
import CustomInput from '@/components/custom-input';
import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function SignIn() {
  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput placeholder="Enter your email" value={''} onChangeText={() => {}} label="Email" keyboardType="email-address" />
      <CustomInput placeholder="Enter your password" value={form.password} onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))} label="Password" secureTextEntry={true} />

      <CustomButton title="Sign In" isLoading={isSubmitting} onPress={submit} />

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">Don't have an account?</Text>
        <Link href="/sign-up" className="base-bold text-primary">
          Sign Up
        </Link>
      </View>
    </View>
  );
}
