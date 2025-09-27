import { View, Text } from 'react-native';
import React from 'react';
import { Button } from '@react-navigation/elements';

export default function SignUp() {
  return (
    <View>
      <Text>sign-up</Text>
      <Button title="Sign Up" onPress={() => router.push('/sign-up')} />
    </View>
  );
}
