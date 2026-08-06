import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthCard } from '../components/auth/AuthCard';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleSuccess = () => {
    navigate(`/dashboard/${role || 'shipper'}`);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 space-y-4 max-w-xl mx-auto">
      {/* Link back to Page 1 Features Showcase */}
      <div className="w-full flex items-center justify-between px-1">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#2563EB] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Features Showcase (Page 1)</span>
        </Link>

        <span className="text-[11px] font-bold text-[#64748B] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Page 2 • Portal Authentication</span>
        </span>
      </div>

      {/* Login Card Component */}
      <div className="w-full">
        <AuthCard onSuccess={handleSuccess} />
      </div>
    </div>
  );
};
