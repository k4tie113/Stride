// src/components/LogoutButton.tsx
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
// ✅ REMOVED: import { useNavigation } from '@react-navigation/native';
// ✅ REMOVED: import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// ✅ REMOVED: import { RootStackParamList } from '../navigation/RootNavigator';
// ✅ REMOVED: import { useUser } from '../state/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabase/client';

// ✅ The component no longer needs navigation props
const LogoutButton = () => {
  // ✅ The hook and state are no longer needed here
  // const navigation = useNavigation<LogoutButtonNavigationProp>();
  // const { setUser } = useUser();

  const handleLogout = async () => {
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
          onPress: async () => {
            // ✅ CORRECT: A single call to Supabase to sign out
            const { error } = await supabase.auth.signOut();
            if (error) {
              Alert.alert('Logout failed', error.message);
            }
            // ✅ The UserContext handles the rest automatically!
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
    top: 40,
    right: 5,
    padding: 10,
    zIndex: 10,
  },
});

export default LogoutButton;