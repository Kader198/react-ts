import React from 'react';
import logo from '../../assets/images/logo.png';

export const Logo: React.FC = () => {
  return (
    <img 
      src={logo} 
      alt="logo" 
      className="w-full h-full object-contain"
    />
  );
}; 