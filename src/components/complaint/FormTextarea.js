// components/complaint/FormTextarea.js
import { IoMdAlert } from "react-icons/io";

export default function FormTextarea({ id, label, value, maxLength, onChange, placeholder, rows = 4, error, className = "", ...props }) {
  return (
    <div className="m-0">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <textarea
          id={id}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          rows={rows}
          className={`w-full p-3 border rounded-md mt-1 resize-vertical focus:outline-none ${
            error ? "border-[#AF2758] focus:border-[#AF2758] pr-10" : "border-[#D6D9E4] focus:border-[#A62D82]"
          }`}
          placeholder={placeholder}
          {...props}
        />
        {error && (
          <div className="absolute right-3 top-[0px] flex items-center h-[48px]">
            <IoMdAlert color="#AF2758" size={20} />
          </div>
        )}
      </div>
      {error && <p className="text-sm text-[#AF2758] mt-1">{error}</p>}
    </div>
  );
}
