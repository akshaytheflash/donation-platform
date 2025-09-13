import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

/**
 * IMPORTANT: This is a SIMULATED authentication system for demo purposes only.
 * In production, replace this with real authentication (JWT, OAuth, Firebase, Supabase, etc.)
 * 
 * Security Notes:
 * - Never store passwords in localStorage in production
 * - Use proper backend authentication with secure token generation
 * - Implement proper password hashing (bcrypt, argon2, etc.)
 * - Use HTTPS in production
 * - Implement rate limiting and account lockout mechanisms
 */

interface User {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
  createdAt: string;
}

interface StoredUser extends User {
  password: string; // Only for demo - NEVER do this in production
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; needsSignUp?: boolean }>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  linkWallet: (walletAddress: string) => void;
  sessionToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate a simulated session token
const generateSessionToken = (): string => {
  const uuid = crypto.randomUUID();
  return `SIM-TOKEN-${uuid}`;
};

// Hash password for demo (NOT secure - production should use bcrypt/argon2 on backend)
const hashPassword = (password: string): string => {
  // Simple hash for demo - DO NOT use in production
  return btoa(password);
};

// Verify password for demo
const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const storedToken = localStorage.getItem('sessionToken');
        const storedUserId = localStorage.getItem('currentUserId');
        
        if (storedToken && storedUserId) {
          const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
          const storedUser = users.find(u => u.id === storedUserId);
          
          if (storedUser) {
            const { password, ...userWithoutPassword } = storedUser;
            setUser(userWithoutPassword);
            setSessionToken(storedToken);
          } else {
            // Invalid session - clear it
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('currentUserId');
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
        // Clear corrupted data
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('currentUserId');
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; needsSignUp?: boolean }> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
      const storedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!storedUser) {
        // User doesn't exist - offer sign up
        return { success: false, needsSignUp: true };
      }
      
      if (!verifyPassword(password, storedUser.password)) {
        toast.error('Invalid password. Please try again.');
        return { success: false };
      }
      
      // Successful sign in
      const token = generateSessionToken();
      const { password: _, ...userWithoutPassword } = storedUser;
      
      setUser(userWithoutPassword);
      setSessionToken(token);
      
      // Persist session
      localStorage.setItem('sessionToken', token);
      localStorage.setItem('currentUserId', storedUser.id);
      
      toast.success(`Welcome back, ${storedUser.name}!`);
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('An error occurred during sign in. Please try again.');
      return { success: false };
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<void> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
      
      // Check if user already exists
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with this email already exists');
      }
      
      // Create new user
      const newUser: StoredUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password: hashPassword(password),
        createdAt: new Date().toISOString(),
      };
      
      // Save user
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto sign in after sign up
      const token = generateSessionToken();
      const { password: _, ...userWithoutPassword } = newUser;
      
      setUser(userWithoutPassword);
      setSessionToken(token);
      
      // Persist session
      localStorage.setItem('sessionToken', token);
      localStorage.setItem('currentUserId', newUser.id);
      
      toast.success(`Welcome to Donify, ${name}!`);
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'An error occurred during sign up. Please try again.');
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
    setSessionToken(null);
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('currentUserId');
    toast.success('You have been signed out successfully');
  };

  const linkWallet = (walletAddress: string) => {
    if (!user) return;
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex].walletAddress = walletAddress;
        localStorage.setItem('users', JSON.stringify(users));
        
        setUser({ ...user, walletAddress });
        toast.success('Wallet linked to your account successfully');
      }
    } catch (error) {
      console.error('Error linking wallet:', error);
      toast.error('Failed to link wallet to account');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      linkWallet,
      sessionToken,
    }}>
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