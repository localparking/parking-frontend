interface ProfileInputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export function ProfileInputField({ label, value, onChange, placeholder }: ProfileInputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-body-5 text-gray-1">{label}</label>
      <input
        className="w-full cursor-pointer rounded-[10px] border border-gray-3 px-3 py-2 text-caption-2 placeholder:text-gray-3 focus:ring-1 focus:ring-primary-1 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
