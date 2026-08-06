/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { DEMO_ROLES } from '../mock/data';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loginAsRole: (targetRole: UserRole) => void;
  loginWithCredentials: (email: string, role?: UserRole, customName?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cargoloop_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const role: UserRole | null = user?.role || null;

  useEffect(() => {
    if (user) {
      localStorage.setItem('cargoloop_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cargoloop_auth_user');
    }
  }, [user]);

  const loginAsRole = (targetRole: UserRole) => {
    const roleInfo = DEMO_ROLES.find((r) => r.role === targetRole);
    const names: Record<UserRole, string> = {
      driver: 'Rajesh Kumar (Driver)',
      shipper: 'Vikram Malhotra (Shipper)',
      fleet: 'Ananya Deshmukh (Fleet Owner)',
      admin: 'Siddharth V. (System Admin)',
    };
    const companies: Record<UserRole, string> = {
      driver: 'Express Highways India',
      shipper: 'Reliance Retail Supply',
      fleet: 'Apex Fleet Logistics',
      admin: 'CargoLoop Control Center',
    };

    const newUser: User = {
      id: `usr-${targetRole}-1`,
      name: names[targetRole],
      email: roleInfo?.email || `${targetRole}@cargoloop.ai`,
      role: targetRole,
      avatar: roleInfo?.avatar,
      companyName: companies[targetRole],
      rating: targetRole === 'driver' ? 4.9 : undefined,
    };

    setUser(newUser);
  };

  const loginWithCredentials = (email: string, forcedRole?: UserRole, customName?: string) => {
    let assignedRole: UserRole = forcedRole || 'shipper';
    const emailLower = email.toLowerCase();
    if (emailLower.includes('driver')) assignedRole = 'driver';
    else if (emailLower.includes('shipper')) assignedRole = 'shipper';
    else if (emailLower.includes('fleet')) assignedRole = 'fleet';
    else if (emailLower.includes('admin')) assignedRole = 'admin';

    const roleInfo = DEMO_ROLES.find((r) => r.role === assignedRole);
    const formattedEmailName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    const displayName = customName?.trim() || formattedEmailName || 'User';

    const companies: Record<UserRole, string> = {
      driver: 'Express Freight Logistics',
      shipper: 'Global Supply Chain Co.',
      fleet: 'Apex Fleet Command',
      admin: 'CargoLoop Control Center',
    };

    const newUser: User = {
      id: `usr-${Date.now().toString(36)}`,
      name: displayName,
      email: email,
      role: assignedRole,
      avatar: roleInfo?.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100`,
      companyName: companies[assignedRole],
      rating: assignedRole === 'driver' ? 4.9 : undefined,
    };

    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        loginAsRole,
        loginWithCredentials,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
