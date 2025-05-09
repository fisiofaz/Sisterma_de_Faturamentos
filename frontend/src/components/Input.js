import React from 'react';

function Input({ label, id, name, value, onChange, ...props }) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input
        type="text" // O tipo pode ser passado como prop, mas vamos começar com text
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

export default Input;