import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAuthSession, signInWithRedirect, signOut, getCurrentUser } from 'aws-amplify/auth';
import '../config/cognito';

interface User {
  email?: string;
  name?: string;
  sub: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  getAccessToken: () => Promise<string | undefined>;
  getIdToken: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();

      // Get user attributes from ID token
      const idToken = session.tokens?.idToken;
      const userName = idToken?.payload?.name as string | undefined;
      const userEmail = idToken?.payload?.email as string | undefined;

      setUser({
        email: userEmail || currentUser.signInDetails?.loginId,
        name: userName || currentUser.username,
        sub: currentUser.userId,
      });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    signInWithRedirect({ provider: 'Google' });
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getAccessToken = async () => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken?.toString();
      console.log('[DEBUG] Access token retrieved:', token ? 'YES (length: ' + token.length + ')' : 'NO');
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return undefined;
    }
  };

  const getIdToken = async () => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      console.log('[DEBUG] ID token retrieved:', token ? 'YES (length: ' + token.length + ')' : 'NO');
      return token;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return undefined;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        getAccessToken,
        getIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
