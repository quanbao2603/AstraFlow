import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { StorageService } from '../../services/storage';
import supabase from '../../config/supabase';

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          displayName: session.user.user_metadata.full_name || session.user.user_metadata.name || session.user.email,
          photoURL: session.user.user_metadata.avatar_url || session.user.user_metadata.picture,
          role: session.user.role,
        };
        StorageService.setToken(session.access_token);
        StorageService.setUser(userData);
        setUser(userData);
      } else {
        // Fallback to local storage if needed, but Supabase is primary
        const token = StorageService.getToken();
        const savedUser = StorageService.getUser();
        if (token && savedUser) {
          setUser(savedUser);
        }
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          displayName: session.user.user_metadata.full_name || session.user.user_metadata.name || session.user.email,
          photoURL: session.user.user_metadata.avatar_url || session.user.user_metadata.picture,
          role: session.user.role,
        };
        login(session.access_token, userData);
      } else {
        setUser(null);
        StorageService.removeToken();
        StorageService.removeUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = (token: string, userData: User) => {
    StorageService.setToken(token);
    StorageService.setUser(userData);
    setUser(userData);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    StorageService.removeToken();
    StorageService.removeUser();
    setUser(null);
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Login with Google error:', error);
      alert('Không thể kết nối với dịch vụ đăng ký Google.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
