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
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string; role?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

// Conta de Administrador exclusiva e oficial do Bazar
export const ADMIN_USER: User = {
  id: 'usr-admin-fabinho',
  name: 'Fabinho (Administrador)',
  email: 'fabinhojr6336@gmail.com',
  phone: '(13) 99803-9867',
  document: '000.000.000-00',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  address: {
    zipCode: '11000-000',
    street: 'Altar Central do Bazar',
    number: '1',
    neighborhood: 'Centro',
    city: 'Santos',
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
        const parsed = JSON.parse(savedUser);
        // Limpar qualquer resquício de conta demonstrativa antiga (ex: Helena Ravena)
        if (parsed.email === 'helena.ravena@obazar.com.br' || parsed.email === 'helena.ravena@exemplo.com' || parsed.email === 'admin@obazardobruxo.com.br') {
          localStorage.removeItem('bazar_auth_user');
          setUser(null);
        } else {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error('Erro ao recuperar usuário logado', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; message?: string; role?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Acesso Administrador Exclusivo
    if (cleanEmail === 'fabinhojr6336@gmail.com') {
      if (password === 'osolealua15') {
        setUser(ADMIN_USER);
        try {
          localStorage.setItem('bazar_auth_user', JSON.stringify(ADMIN_USER));
        } catch (e) {}
        return { success: true, role: 'admin' };
      } else {
        return {
          success: false,
          message: 'Senha incorreta para a conta de administrador.',
        };
      }
    }

    // 2. Verificar no banco local de usuários cadastrados (clientes reais)
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
        // Garantir que nenhum outro usuário registrado tenha papel de administrador
        const customerData = { ...userData, role: 'customer' as const };
        setUser(customerData);
        localStorage.setItem('bazar_auth_user', JSON.stringify(customerData));
        return { success: true, role: 'customer' };
      }
    } catch (e) {}

    return {
      success: false,
      message: 'E-mail ou senha não encontrados no Círculo do Bazar.',
    };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();

    // Proteger e-mail do administrador contra registro indevido
    if (cleanEmail === 'fabinhojr6336@gmail.com') {
      return {
        success: false,
        message: 'Este e-mail pertence exclusivamente ao Administrador do Bazar. Acesse pela tela de login.',
      };
    }

    // Criar estritamente como cliente (nunca admin)
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      document: data.document.trim(),
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      address: data.address,
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
