import {
  TextField,
  Box,
  IconButton,
  InputAdornment
} from "@mui/material";
import { useState, forwardRef } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const PasswordInput = forwardRef(function PasswordInput(
  { label = "", placeholder = "", required = false, ...rest },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box>
      {label && (
        <Box sx={{ fontSize: "16px", fontWeight: 500, mb: 1 }}>{label}</Box>
      )}
      <TextField
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        required={required}
        fullWidth
        variant="outlined"
        inputRef={ref}
        {...rest}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePassword} edge="end">
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
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
        }}
      />
    </Box>
  );
});

export default PasswordInput;
