import type React from 'react';
import { User, LogOut } from 'lucide-react';
import { Button } from '../core';

interface DashboardHeaderProps {
  userName?: string;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'User',
  onLogout,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome Back, {userName}</h1>
              <p className="text-blue-100">Manage your wallet and signatures</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="md"
            onClick={onLogout}
            leftIcon={<LogOut className="h-4 w-4" />}
            className="bg-white/20 hover:bg-white/30 text-white border-white/20 hover:border-white/30"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
