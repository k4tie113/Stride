// src/screens/SignUpScreen.tsx
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { colors } from '../theme';
import logo from '../images/logo.png'
import { supabase } from '../supabase/client';
import { useUser } from '../state/UserContext';

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
};

type SignUpScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
};
  
export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  

  const handleSignUp = async () => {
    setLoading(true);
    console.log('Attempting sign up...'); 

    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
        Alert.alert('Passwords do not match', 'Please make sure your passwords are the same.');
        setLoading(false);
        return;
    }

    // Call Supabase sign up
    const { error: signUpError } = await supabase.auth.signUp({ email, password });

    setLoading(false);
    
    if (signUpError) {
      console.log('Sign up failed:', signUpError.message);
      Alert.alert('Sign Up Failed', signUpError.message);
    } else {
      // ✅ CORRECTED FLOW: The navigation call has been removed.
      // Your RootNavigator will automatically handle the screen change.
      Alert.alert(
        'Success!', 
        'Please check your email to confirm your account before logging in.'
      );
    }
  };
  
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />

        <TextInput
          placeholder="Name"
          placeholderTextColor={colors.whiteTransparent60}
          style={styles.input}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.whiteTransparent60}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
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
        
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor={colors.whiteTransparent60}
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
          secureTextEntry
        />

        <View style={styles.buttonWrapper}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSignUp}
              disabled={loading}
            >
                <Text style={styles.buttonText}>
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </Text>
            </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signupLink}>Log in</Text>
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