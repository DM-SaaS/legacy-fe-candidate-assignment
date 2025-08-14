import React from 'react';
import { Settings as SettingsIcon, Shield, ArrowLeft } from 'lucide-react';
import { MfaManagement } from './MfaManagement';

interface SettingsProps {
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-accent-600 hover:text-accent-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent-600 rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account settings and security preferences</p>
            </div>
          </div>
        </div>


        <div className="space-y-8">

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Security & Authentication</h2>
                  <p className="text-sm text-gray-600">Manage your multi-factor authentication settings</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <MfaManagement />
            </div>
          </div>

    
        </div>
      </div>
    </div>
  );
}; 