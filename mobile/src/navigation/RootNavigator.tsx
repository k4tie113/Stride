// src/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUser } from '../state/UserContext';
import LoginScreen from '../screens/LoginScreen';
import BottomTab from './BottomTab';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

const NativeStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user } = useUser();

  return (
    <NativeStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // ✅ If a user is logged in, show the Main app with Bottom Tabs
        <NativeStack.Screen name="Main" component={BottomTab} />
      ) : (
        // ✅ If no user, show the Login screen
        <NativeStack.Screen name="Login" component={LoginScreen} />
      )}
    </NativeStack.Navigator>
  );
}