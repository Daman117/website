import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ width = 20, height = 20 }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
    <line x1="6" y1="6" x2="18" y2="18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity=".92"/>
    <line x1="18" y1="6" x2="6" y2="18" stroke="#7FC6E6" strokeWidth="1.6" strokeLinecap="round" opacity=".92"/>
    <circle cx="6" cy="6" r="2.1" fill="#fff"/>
    <circle cx="18" cy="6" r="2.1" fill="#7FC6E6"/>
    <circle cx="6" cy="18" r="2.1" fill="#7FC6E6"/>
    <circle cx="18" cy="18" r="2.1" fill="#fff"/>
    <circle cx="12" cy="12" r="2.6" fill="#fff" stroke="#0B2545" strokeWidth="1"/>
  </svg>
);

export default Logo;
