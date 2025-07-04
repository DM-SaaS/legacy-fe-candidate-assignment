import React from 'react';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header
      className={`w-full bg-gray-900 border-b border-blue-800 py-4 px-6 flex flex-col sm:flex-row items-center justify-between ${className}`}
    >
      <div className="text-blue-400 font-extrabold text-xl tracking-wide">
        SecureConnect
      </div>
      <p className="mt-2 sm:mt-0 text-gray-400 text-sm italic">
        Authenticate & Sign Messages Safely
      </p>
    </header>
  );
};

export default Header;
