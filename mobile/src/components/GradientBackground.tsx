import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: any;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, style }) => {
    return (
      <LinearGradient
        colors={[colors.yellow, colors.purpleLight, colors.purple]}
        start={{ x: 0, y: -0.2 }}
        end={{ x: 2.7, y: 1.1 }}
        style={[styles.container, style]}
      >
        <View style={styles.inner}>{children}</View>
      </LinearGradient>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inner: {
      flex: 1,
    },
  });
  