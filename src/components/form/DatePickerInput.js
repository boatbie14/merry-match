import React, { useState } from "react";
import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { IoCalendarOutline } from "react-icons/io5";

export default function DatePickerInput({
    label = "",
    name = "",
    value,
    onChange,
    placeholder = "dd/MM/yyyy",
  }) {
    const [internalValue, setInternalValue] = useState(value || null);
  
    const handleChange = (newValue) => {
      setInternalValue(newValue);
  
      if (onChange && typeof onChange === "function") {
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
                sx: {
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
            }}
          />
        </LocalizationProvider>
      </Box>
    );
  }
  