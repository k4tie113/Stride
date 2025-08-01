// src/navigation/LogoutButton.tsx
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type LogoutButtonNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const LogoutButton = () => {
  const navigation = useNavigation<LogoutButtonNavigationProp>();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            // ✅ This is the key step: reset the navigation state
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <Ionicons name="log-out" size={30} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    position: 'absolute',
    top: 40, // Adjust this value to position the button correctly
    right: 5, // Adjust this value to position the button correctly
    padding: 10,
    zIndex: 10,
  },
});

export default LogoutButton;