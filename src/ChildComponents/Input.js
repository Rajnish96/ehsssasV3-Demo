import React from "react";

function Input({
  placeholder,
  type,
  name,
  value,
  onChange,
  defaultValue,
  className,
  disabled,
  checked,
  step,
  autoComplete,
  onKeyDown,
  onInput,
  onBlur,
  max,
  readOnly,
  required
}) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      className={className}
      onChange={onChange}
      disabled={disabled}
      defaultValue={defaultValue}
      step={step}
      checked={checked}
      autoComplete={autoComplete}
      onKeyDown={onKeyDown}
      onInput={onInput}
      max={max}
      readOnly={readOnly}
      onBlur={onBlur}
      required={required}
    />
  );
}

export default Input;
