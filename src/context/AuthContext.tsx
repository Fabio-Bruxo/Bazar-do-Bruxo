'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserAddress } from '@/types';

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  document: string;
  password?: string;
  address: UserAddress;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  loginDemo: () => void;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

// Usuário padrão de demonstração - Cliente
export const DEMO_USER: User = {
  id: 'usr-helena-01',
  name: 'Helena Ravena',
  email: 'helena.ravena@obazar.com.br',
  phone: '(11) 98765-4321',
  document: '123.456.789-00',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  address: {
    zipCode: '01310-100',
    street: 'Avenida Paulista',
    number: '1500',
    complement: 'Apt 82',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
  },
  createdAt: '2026-08-15T10:00:00Z',
};

// Usuário padrão de demonstração - Administrador
export const ADMIN_USER: User = {
  id: 'usr-admin-01',
  name: 'O Bruxo Regente (Administrador)',
  email: 'admin@obazardobruxo.com.br',
  phone: '(11) 99988-7766',
  document: '000.000.000-00',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  address: {
    zipCode: '01001-000',
    street: 'Praça da Sé (Altar Central)',
    number: '1',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
  },
  createdAt: '2026-01-01T00:00:00Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('bazar_auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Erro ao recuperar usuário logado', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; message?: string; role?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Acesso Administrador
    if (cleanEmail === 'admin@obazardobruxo.com.br' || cleanEmail === 'admin@bazar.com') {
      if (!password || password === 'admin123' || password.length > 0) {
        setUser(ADMIN_USER);
        try {
          localStorage.setItem('bazar_auth_user', JSON.stringify(ADMIN_USER));
        } catch (e) {}
        return { success: true, role: 'admin' };
      }
    }

    // 2. Acesso Cliente Demo (Helena Ravena)
    if (cleanEmail === 'helena.ravena@exemplo.com' || cleanEmail === 'helena.ravena@obazar.com.br' || cleanEmail === 'helena@obazar.com.br') {
      setUser(DEMO_USER);
      try {
        localStorage.setItem('bazar_auth_user', JSON.stringify(DEMO_USER));
      } catch (e) {}
      return { success: true, role: 'customer' };
    }

    // 3. Verificar no banco local de usuários cadastrados
    try {
      const savedUsers: (User & { password?: string })[] = JSON.parse(
        localStorage.getItem('bazar_registered_users') || '[]'
      );
      const found = savedUsers.find((u) => u.email.toLowerCase() === cleanEmail);

      if (found) {
        if (password && found.password && found.password !== password) {
          return {
            success: false,
            message: 'Senha incorreta para esta conta.',
          };
        }
        const { password: _, ...userData } = found;
        setUser(userData);
        localStorage.setItem('bazar_auth_user', JSON.stringify(userData));
        return { success: true, role: userData.role || 'customer' };
      }
    } catch (e) {}

    return {
      success: false,
      message: 'E-mail ou senha não encontrados no Círculo do Bazar.',
    };
  };

  const loginDemo = () => {
    setUser(DEMO_USER);
    try {
      localStorage.setItem('bazar_auth_user', JSON.stringify(DEMO_USER));
    } catch (e) {}
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      document: data.document.trim(),
      address: data.address,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
      createdAt: new Date().toISOString(),
    };

    try {
      const existing: (User & { password?: string })[] = JSON.parse(
        localStorage.getItem('bazar_registered_users') || '[]'
      );
      if (existing.some((u) => u.email.toLowerCase() === cleanEmail)) {
        return { success: false, message: 'Este e-mail já possui uma conta no Bazar.' };
      }

      existing.push({ ...newUser, password: data.password });
      localStorage.setItem('bazar_registered_users', JSON.stringify(existing));
      localStorage.setItem('bazar_auth_user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (e) {
      return { success: false, message: 'Falha ao salvar seu registro no Bazar.' };
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('bazar_auth_user');
    } catch (e) {}
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    try {
      localStorage.setItem('bazar_auth_user', JSON.stringify(updated));
      const registered: User[] = JSON.parse(localStorage.getItem('bazar_registered_users') || '[]');
      const updatedList = registered.map((u) => (u.id === user.id ? { ...u, ...data } : u));
      localStorage.setItem('bazar_registered_users', JSON.stringify(updatedList));
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginDemo,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
