import React from 'react';
import { Text, View } from 'react-native';

export default function SignUp() {
  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput placeholder="Enter your full name" value={form.name} onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))} label="Full name" />
      <CustomInput placeholder="Enter your email" value={form.email} onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))} label="Email" keyboardType="email-address" />
      <CustomInput placeholder="Enter your password" value={form.password} onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))} label="Password" secureTextEntry={true} />

      <CustomButton title="Sign Up" isLoading={isSubmitting} onPress={submit} />

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">Already have an account?</Text>
        <Link href="/sign-in" className="base-bold text-primary">
          Sign In
        </Link>
      </View>
    </View>
  );
}
