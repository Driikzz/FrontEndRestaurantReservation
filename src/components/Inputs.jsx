import React from 'react';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  name,
  ...rest
}) => (
  <div style={{ marginBottom: '1rem' }}>
    {label && (
      <label
        htmlFor={name}
        style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
      >
        {label}
      </label>
    )}
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        padding: '0.5rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
        boxSizing: 'border-box',
      }}
      {...rest}
    />
  </div>
);

export default Input;
