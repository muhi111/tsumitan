import type React from 'react';
import GoogleIcon from './GoogleIcon';

interface GoogleSignInButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onClick,
  disabled = false,
  children
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    >
      <GoogleIcon />
      {children}
    </button>
  );
};

export default GoogleSignInButton;
