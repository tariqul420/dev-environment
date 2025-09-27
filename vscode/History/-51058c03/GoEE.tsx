import { router } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';

export default function SignUp() {
  return (
    <View>
      <Text>sign-up</Text>
      <Button title="Sign In" onPress={() => router.push('/sign-in')} />
    </View>
  );
}
