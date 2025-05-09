import React from 'react';

function Button({ children, onClick, className, ...props }) {
  return (
    <button onClick={onClick} className={`button ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;