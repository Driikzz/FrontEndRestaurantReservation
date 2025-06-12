import React from 'react';

const Inputs = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  disabled = false,
  error = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className={`form-label ${required ? 'form-label--required' : ''}`}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`form-input ${error ? 'form-input--error' : ''} ${className}`}
        {...props}
      />
    </div>
  );
};

export default Inputs;
