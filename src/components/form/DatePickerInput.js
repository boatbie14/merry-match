import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { IoCalendarOutline } from "react-icons/io5";

/**
 * Flexible DatePickerInput
 * - ใช้ได้ทั้ง controlled (value/onChange) และ uncontrolled
 * - รองรับ label, name, placeholder, ...props
 */
export default function DatePickerInput({
  label = "",
  name = "",
  placeholder = "dd/MM/yyyy",
  value,
  onChange,
  ...props
}) {
  // ถ้า controlled จะใช้ value/onChange จาก props
  // ถ้าไม่ controlled จะใช้ state ภายใน
  const isControlled = value !== undefined && typeof onChange === "function";
  const [internalValue, setInternalValue] = useState(value ?? null);

  // sync internalValue ถ้า value จากข้างนอกเปลี่ยน (กรณี controlled)
  useEffect(() => {
    if (isControlled) {
      setInternalValue(value);
    }
  }, [value, isControlled]);

  // handle change
  const handleChange = (newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    if (onChange && typeof onChange === "function") {
      // ถ้ามี name ส่ง event แบบ input
      if (name) {
        onChange({
          target: {
            name,
            value: newValue,
          },
        });
      } else {
        onChange(newValue);
      }
    }
  };

  return (
    <Box>
      {label && (
        <Box sx={{ fontSize: "16px", fontWeight: 500, mb: 1 }}>{label}</Box>
      )}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          value={internalValue}
          onChange={handleChange}
          maxDate={new Date()}
          format="dd/MM/yyyy"
          slots={{
            openPickerIcon: IoCalendarOutline,
          }}
          slotProps={{
            textField: {
              name,
              fullWidth: true,
              placeholder,
              InputProps: {
                sx: {
                  background: "#ffffff",
                  height: "48px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#D6D9E4",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#D6D9E4",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#A62D82",
                      borderWidth: "1px",
                    },
                  },
                  "& input": {
                    padding: "12px 14px 16px 14px",
                    "::placeholder": {
                      color: "#A0A3BD",
                      opacity: 1,
                    },
                  },
                },
              },
            },
          }}
          {...props}
        />
      </LocalizationProvider>
    </Box>
  );
}
