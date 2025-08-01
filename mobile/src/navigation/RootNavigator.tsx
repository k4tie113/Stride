// src/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import BottomTab from './BottomTab';

// ✅ Define a single Stack Navigator that holds both the Login and the Main App
const Stack = createNativeStackNavigator();

export type RootStackParamList = {
    Login: undefined;
    Main: undefined;
  };

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={BottomTab} />
    </Stack.Navigator>
  );
}