// src/navigation/LogoutButton.tsx
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // ✅ CORRECTED import
import { RootStackParamList } from '../navigation/RootNavigator';
import { useUser } from '../state/UserContext';

// ✅ Use NativeStackNavigationProp here as well
type LogoutButtonNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const LogoutButton = () => {
  const navigation = useNavigation<LogoutButtonNavigationProp>();
  const { setUser } = useUser();

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
            setUser(null);
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
    top: 40,
    right: 5,
    padding: 10,
    zIndex: 10,
  },
});

export default LogoutButton;