// FormInput.js

import { IoMdAlert } from "react-icons/io";

export default function FormInput({
  id,
  label,
  type = "text",
  value,
  maxLength,
  onChange,
  placeholder,
  required = false,
  error = "",
  className = "",
  ...props
}) {
  return (
    <div className="m-0">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          required={required}
          className={`w-full p-3 border rounded-md mt-1 focus:outline-none ${
            error ? "border-[#AF2758] focus:border-[#AF2758] pr-10" : "border-[#D6D9E4] focus:border-[#A62D82]"
          }`}
          placeholder={placeholder}
          {...props}
        />
        {error && (
          <div className="absolute right-3 top-[5px] flex items-center h-[48px]">
            <IoMdAlert color="#AF2758" size={20} />
          </div>
        )}
      </div>
      {error && <p className="text-sm text-[#AF2758] mt-1">{error}</p>}
    </div>
  );
}
