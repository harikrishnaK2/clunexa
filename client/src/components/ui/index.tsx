import React from 'react';

export const Button = ({ children, variant = 'primary', onClick, disabled, className = '' }: any) => {
  const baseStyle = "font-bold px-6 py-3 rounded-xl transition-all duration-200";
  const primaryStyle = "bg-brand hover:bg-brand-light text-ink active:scale-95";
  const secondaryStyle = "border border-brand/30 text-brand-light hover:bg-brand/10 font-semibold";
  const disabledStyle = "opacity-50 cursor-not-allowed pointer-events-none";

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variant === 'primary' ? primaryStyle : secondaryStyle} ${disabled ? disabledStyle : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = (props: any) => {
  return (
    <input 
      {...props}
      className={`bg-surface-alt border border-white/10 text-ink rounded-xl px-4 py-3 focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 w-full ${props.className || ''}`}
    />
  );
};

export const Card = ({ children, className = '' }: any) => {
  return (
    <div className={`bg-surface border border-white/8 rounded-2xl shadow-lg shadow-brand/10 p-6 ${className}`}>
      {children}
    </div>
  );
};
