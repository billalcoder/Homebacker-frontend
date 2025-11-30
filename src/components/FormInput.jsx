import React from 'react';

const FormInput = ({ label, type = "text", name, value, onChange, placeholder, required = false , text ,disable = false }) => {
  return (
    <div className="mb-4 w-full">
      <label className="block text-stone-600 text-sm font-semibold mb-2" htmlFor={name}>
        {label} {required && <span className="text-amber-600">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        defaultValue={text}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disable}
        className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200 ease-in-out placeholder-stone-400"
      />
    </div>
  );
};

export default FormInput;