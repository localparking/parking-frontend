import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: 'text' | 'password'
}

export function Input({ className = '', value, onChange, placeholder, type = 'text', ...restProps }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-[10px] border border-gray-3 px-4 py-3 text-body-5 placeholder:text-body-5 placeholder:text-gray-3 focus:outline-none ${className}`}
      {...restProps}
    />
  )
}
