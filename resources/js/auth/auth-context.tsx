import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

type User = {
  id: number;
  username: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, password: string, passwordConfirmation: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const res = await api.get('/api/v1/whoami');
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Register request
   * @param username 
   * @param password 
   * @param passwordConfirm 
   */
  const register = async(username: string, password: string, passwordConfirm: string) => {
    await api.get('/sanctum/csrf-cookie');
    
    const res = await api.post('/api/v1/register', {
      username,
      password,
      password_confirmation: passwordConfirm
    });

    setUser(res.data.user);
  };

  /**
   * Login request
   * 
   * @param username 
   * @param password 
   */
  const login = async (username: string, password: string) => {
    await api.get('/sanctum/csrf-cookie');

    const res = await api.post('/api/v1/login', {
      username,
      password,
    });

    setUser(res.data.user);
  };

  /**
   * Logout request
   */
  const logout = async () => {
    await api.post('/api/v1/logout');
    setUser(null);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
