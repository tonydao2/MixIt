import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export default function Button({ onClick, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className='mt-6 px-6 py-3 bg-white text-black font-bold text-lg rounded-full hover:bg-green-500 hover:text-white transition-colors duration-200'
    >
      {children}
    </button>
  );
}
