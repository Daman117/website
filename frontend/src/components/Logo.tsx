import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ height = 34 }) => (
  <img src="/logo-mark.png" alt="" width={height * (836 / 392)} height={height} className="u-block" />
);

export default Logo;
