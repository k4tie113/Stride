import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import RunsScreen from '../screens/ProgressScreen';
import PlansScreen from '../screens/PlansScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { BlurView } from 'expo-blur';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
      tabBarStyle: {
        position: 'absolute',
        borderTopWidth: 2,
        backgroundColor: 'transparent', // important!
        borderTopColor: colors.whiteTransparent20,
        elevation: 0,
      },
      tabBarBackground: () => (
        <BlurView tint="light" intensity={60} style={StyleSheet.absoluteFill} />
      ),
      tabBarActiveTintColor: colors.yellow,
      tabBarInactiveTintColor: colors.white,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string = 'home';
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Progress') iconName = 'trending-up';
        else if (route.name === 'Training') iconName = 'calendar';
        else if (route.name === 'AI Analysis') iconName = 'walk';
  
        return <Ionicons name={iconName} size={20} color={color} />;
      },
    })}
  >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Progress" component={RunsScreen} />
      <Tab.Screen name="Training" component={PlansScreen} />
      <Tab.Screen name="AI Analysis" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Just for now: placeholder screens
function PlaceholderScreen() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.whiteTransparent80,
    fontSize: 18,
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // soft white translucent
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)', // soft border
    backdropFilter: 'blur(10px)', // optional with web
  },
});
