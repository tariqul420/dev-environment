import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function CardButton() {
  const totalItems = 10;

  return (
    <TouchableOpacity className="cart-btn">
      <Image source={images.bag} className="size-5" resizeMode="contain" />
    </TouchableOpacity>
  );
}
