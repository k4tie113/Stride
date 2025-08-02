// src/context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'; // ✅ Import useEffect
import { User } from '../api/client';
import apiClient from '../api/client'; // ✅ Import the apiClient
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of our context data
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean; // ✅ Add a loading state
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component that will wrap your app
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ New state for loading

  // ✅ Add this useEffect hook to load the user on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        console.log('Found stored token:', storedToken ? 'Yes' : 'No');

        if (storedToken) {
          // In a real app, you would validate this token with your backend.
          // For now, we'll just assume it's valid and create a user object.
          const fakeUser: User = {
            id: 'user-123',
            username: 'runner_katie',
            password: 'pass123',
            firstname: 'Katie',
            token: 'mock-token-123', // ✅ Add a mock token
            currentPlanId: 'plan-002',
            currentWeek: 2,
            planStartDate: '2025-07-15',
          };
          setUser(fakeUser);
          apiClient.setToken(storedToken);
        }
      } catch (error) {
        console.error('Failed to load token:', error);
      } finally {
        setIsLoading(false); // ✅ Set loading to false when done
      }
    };

    loadUser();
  }, []); // ✅ Empty dependency array to run only once

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to make using the context easier
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

/*// src/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of our context data
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component that will wrap your app
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to make using the context easier
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};*/