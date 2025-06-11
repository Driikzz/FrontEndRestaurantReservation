import React from 'react';

const PrimaryButton = ({ children, onClick, type = 'button', disabled = false, style = {} }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        fontSize: '16px',
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
