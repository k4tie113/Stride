// src/screens/LoginScreen.tsx (Corrected)
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import apiClient from '../api/client';
import { GradientBackground } from '../components/GradientBackground';
import { colors } from '../theme';
import { Image } from 'react-native';
import logo from '../images/logo.png'

import { useUser } from '../state/UserContext'; // ✅ Import the new hook


// ✅ Define the RootStackParamList with both screens
type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

// ✅ The LoginScreen will now receive the standard navigation prop
type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};
  
export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser(); // ✅ CORRECT: Call the hook at the top level
  const handleLogin = async () => {
    console.log('Attempting login...'); // ✅ Add this log
    // ✅ Use the apiClient to log in
    const user = await apiClient.login(username, password);

    if (user) {
        console.log('Login successful, setting user:', user); // ✅ Add this log
      // ✅ If login is successful, reset the navigation stack
      //    This removes the Login screen from the history and replaces it with 'Main'
      setUser(user); // ✅ Save the user to the global state
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } else {
        console.log('Login failed, showing alert.'); // ✅ Add this log
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };
  
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />

        <TextInput
          placeholder="Username"
          placeholderTextColor={colors.whiteTransparent60}
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.whiteTransparent60}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
        />
        <View style={styles.buttonWrapper}>
            {/* ✅ Call handleLogin on press */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
        </View>
      </View>
    </GradientBackground>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  input: {
    height: 48,
    backgroundColor: colors.whiteTransparent20,
    borderRadius: 10,
    paddingHorizontal: 20,
    color: colors.white,
    marginBottom: 20,
  },
  buttonWrapper: {
    alignItems: 'center',
  },
  
  button: {
    backgroundColor: colors.yellow,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: 'center',
  },  
  buttonText: {
    color: colors.purple,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logo: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: 10,
  },
  
});
