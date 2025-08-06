// src/state/UserContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { supabase } from '../supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

// ✅ Define the Profile type to match your Supabase 'users' table
export interface Profile {
  id: string;
  name: string;
  current_plan_id: string | null;
  current_week: number | null;
}

interface UserContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// ✅ Corrected the syntax here to { children: ReactNode }
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // A helper function to fetch the user's profile from the 'users' table
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`id, name, current_plan_id, current_week`)
        .eq('id', userId)
        .single();
      
      if (error) {
        console.warn('Error fetching profile:', error.message);
        // Do not throw the error, just return null if the profile doesn't exist.
        return null; 
      }
      return data as Profile;

    } catch (error) {
      console.error('An unexpected error occurred while fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('UserContext: Subscribing to auth state changes...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log(`UserContext: Auth state changed. Event: ${_event}`);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session) {
          console.log('UserContext: Session found, fetching profile...');
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        } else {
          console.log('UserContext: No session found.');
          setProfile(null);
        }

        setIsLoading(false);
        console.log('UserContext: Finished processing auth state. isLoading is now false.');
      }
    );

    return () => {
      console.log('UserContext: Unsubscribing from auth state changes.');
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, profile, session, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};