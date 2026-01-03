import React from 'react';

interface VTLogoProps {
  size?: number;
  className?: string;
}

export const VTLogo: React.FC<VTLogoProps> = ({ size = 32, className = '' }) => {
  return (
    <img 
      src="/assets/logo.png" 
      alt="Corallum Logo" 
      width={size} 
      height={size} 
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

