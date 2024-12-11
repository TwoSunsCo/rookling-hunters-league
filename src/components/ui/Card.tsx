import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={clsx(
      'bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50',
      'transition-all duration-300 hover:shadow-xl hover:scale-[1.02]',
      className
    )}>
      {children}
    </div>
  );
};