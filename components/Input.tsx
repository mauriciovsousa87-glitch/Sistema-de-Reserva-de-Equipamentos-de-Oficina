import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      <input
        className={`border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, error, className = '', children, ...props }) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
        <select
          className={`border rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
          {...props}
        >
            {children}
        </select>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  };
