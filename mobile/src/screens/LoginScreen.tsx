// src/screens/LoginScreen.tsx
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
// ✅ REMOVED: import apiClient from '../api/client';
import { GradientBackground } from '../components/GradientBackground';
import { colors } from '../theme';
import logo from '../images/logo.png'

// ✅ IMPORT the real supabase client
import { supabase } from '../supabase/client';

// ✅ IMPORT the useUser hook
import { useUser } from '../state/UserContext'; 

// ✅ Define the RootStackParamList with both screens
type RootStackParamList = {
  Login: undefined;
  SignUp: undefined; // Add SignUp to the stack
  Main: undefined;
};

// ✅ The LoginScreen will now receive the standard navigation prop
type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};
  
export default function LoginScreen({ navigation }: LoginScreenProps) {
  // ✅ Change the state variable from 'username' to 'email'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // ✅ We will refactor this hook later to listen to Supabase state
  const { setUser } = useUser(); 

  const handleLogin = async () => {
    setLoading(true);
    console.log('Attempting login...'); 

    // ✅ CORRECT: Use the supabase client to log in with email and password
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    
    if (error) {
      console.log('Login failed:', error.message);
      Alert.alert('Login Failed', error.message);
    } else {
      console.log('Login successful.');
      // ✅ We don't need to manually set the user or navigate here.
      // The UserContext will handle this automatically by listening to the Supabase session.
    }
  };
  
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />

        <TextInput
          // ✅ Change the placeholder to 'Email'
          placeholder="Email"
          placeholderTextColor={colors.whiteTransparent60}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address" // ✅ Recommended for email inputs
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
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleLogin}
              disabled={loading} // ✅ Disable the button while loading
            >
                <Text style={styles.buttonText}>
                  {loading ? 'Logging In...' : 'Log In'}
                </Text>
            </TouchableOpacity>
        </View>

        {/* ✅ This is the only new section I have added */}
        <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signupLink}>Sign up</Text>
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
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignSelf: 'center',
  },
  signupText: {
    color: colors.whiteTransparent80,
    fontSize: 14,
    marginRight: 5,
  },
  signupLink: {
    color: colors.yellow,
    fontSize: 14,
    fontWeight: 'bold',
  },
});