import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'secondary' | 'outline';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <i className="fas fa-circle-notch fa-spin"></i>}
      {children}
    </button>
  );
};

export default Button;
