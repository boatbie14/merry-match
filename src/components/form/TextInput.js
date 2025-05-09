// components/form/TextInput.js
import { TextField, Box } from "@mui/material";

export default function TextInput({
  label = "",
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  type = "text",
}) {
  return (
    <Box>
      {label && (
        <Box sx={{ fontSize: "16px", fontWeight: 500, mb: 1 }}>{label}</Box>
      )}
      <TextField
        name={name}
        type={type}
        placeholder={placeholder}
        variant="outlined"
        fullWidth
        required={required}
        value={value}
        onChange={onChange}
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
}
