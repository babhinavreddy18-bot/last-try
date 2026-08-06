import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthCard } from '../components/auth/AuthCard';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleSuccess = () => {
    navigate(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <AuthCard onSuccess={handleSuccess} />
    </div>
  );
};
