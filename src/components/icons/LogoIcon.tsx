import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="none"
    {...props}
  >
    <g transform="translate(32, 52) scale(0.88)">
      <path d="M 50 250 L 100 250 L 150 100 L 225 350 L 300 100 L 350 250 L 450 250" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="48" 
            strokeLinecap="round" 
            strokeLinejoin="round" />
      <circle cx="150" cy="100" r="24" fill="currentColor" />
      <circle cx="300" cy="100" r="24" fill="currentColor" />
      <circle cx="225" cy="350" r="24" fill="currentColor" />
    </g>
  </svg>
);

