import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#7C3AED', // Purple
    secondary: '#FFD700', // Yellow
    background: '#7C3AED',
    surface: 'rgba(255, 255, 255, 0.1)',
    surfaceVariant: 'rgba(255, 255, 255, 0.15)',
    onSurface: '#FFFFFF',
    onSurfaceVariant: 'rgba(255, 255, 255, 0.7)',
    outline: 'rgba(255, 255, 255, 0.2)',
  },
};

export const colors = {
  purpleLight: '#b28cd4',
  purple: '#9469e6',
  yellow: '#FFD700',
  yellowBright: '#FFC107',
  white: '#FFFFFF',
  whiteTransparent: 'rgba(255, 255, 255, 0.1)',
  whiteTransparent15: 'rgba(255, 255, 255, 0.15)',
  whiteTransparent20: 'rgba(255, 255, 255, 0.2)',
  whiteTransparent60: 'rgba(255, 255, 255, 0.6)',
  whiteTransparent70: 'rgba(255, 255, 255, 0.7)',
  whiteTransparent80: 'rgba(255, 255, 255, 0.8)',
};