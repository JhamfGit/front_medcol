// src/components/ui/Input.tsx
import React, { ReactNode } from 'react';

interface InputProps {
  icon?: ReactNode;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  className?: string;
}

export default function Input({ 
  icon, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  name, 
  className = '' 
}: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        className={`w-full py-2 ${icon ? 'pl-10' : 'pl-3'} pr-3 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
    </div>
  );
}