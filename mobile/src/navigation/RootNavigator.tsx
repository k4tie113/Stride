// src/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native'; // ✅ Import View, ActivityIndicator, and StyleSheet
import { useUser } from '../state/UserContext';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen'; // ✅ Import SignUpScreen
import BottomTab from './BottomTab';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
};

const NativeStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, isLoading } = useUser(); // ✅ Get the isLoading state from the context

  if (isLoading) {
    // ✅ If the app is still loading (checking for a stored token), show a loading spinner
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NativeStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // ✅ If a user is logged in, show the Main app with Bottom Tabs
        <NativeStack.Screen name="Main" component={BottomTab} />
      ) : (
        // ✅ If no user, show the Login screen
        <NativeStack.Group>
          <NativeStack.Screen name="Login" component={LoginScreen} />
          <NativeStack.Screen name="SignUp" component={SignUpScreen} />
        </NativeStack.Group>
      )}
    </NativeStack.Navigator>
  );
}

// ✅ Add a simple stylesheet for the loading screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});