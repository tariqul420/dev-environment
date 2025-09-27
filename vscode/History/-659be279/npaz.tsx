import { router } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';

export default function SignIn() {
  return (
    <View>
      <Text>sign-in</Text>
      <Button title="Sign In" onPress={() => router.push('/sign-up')} />
    </View>
  );
}
