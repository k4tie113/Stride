import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTab from './src/navigation/BottomTab';

export default function App() {
  return (
    <NavigationContainer>
      <BottomTab />
    </NavigationContainer>
  );
}
