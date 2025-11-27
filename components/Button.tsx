import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden py-4 px-6 rounded-2xl font-bold text-lg tracking-wide transition-all duration-200 transform active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-lg";
  
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:brightness-110 border border-white/10",
    secondary: "bg-gray-800 text-white border border-gray-600 hover:bg-gray-700 hover:border-gray-500 shadow-black/20",
    danger: "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-red-500/30 hover:shadow-red-500/50 hover:brightness-110 border border-white/10",
    ghost: "bg-transparent text-indigo-300 hover:text-white hover:bg-white/10 shadow-none",
    glass: "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 shadow-xl"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default Button;