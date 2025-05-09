import { Box, MenuItem, Select, FormControl } from "@mui/material";

export default function SelectInput({
  label = "",
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  required = false,
}) {
  return (
    <Box>
      {label && (
        <Box sx={{ fontSize: "16px", fontWeight: 500, mb: 1 }}>{label}</Box>
      )}
      <FormControl fullWidth required={required}>
        <Select
          name={name}
          value={value}
          onChange={onChange}
          displayEmpty
          sx={{
            height: "48px",
            borderRadius: "8px",
            fontSize: "16px",
            "& .MuiSelect-select": {
              color: value ? "#000" : "#A0A3BD",
              paddingTop: "12px",
              paddingBottom: "12px",
            },
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
          }}
        >
          <MenuItem value="" disabled>
            <span style={{ color: "#A0A3BD" }}>{placeholder}</span>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
