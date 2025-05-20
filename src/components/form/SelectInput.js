import {
  Box,
  MenuItem,
  Select,
  FormControl,
  Autocomplete,
  TextField,
} from "@mui/material";

export default function SelectInput({
  label = "",
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  required = false,
  autoSwitchThreshold = 15,
}) {
  const useAutocomplete = options.length > autoSwitchThreshold;

  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <Box>
      {label && (
        <Box sx={{ fontSize: "16px", fontWeight: 500, mb: 1 }}>{label}</Box>
      )}

      {useAutocomplete ? (
        <Autocomplete
          options={options}
          getOptionLabel={(option) => option?.label || ""}
          isOptionEqualToValue={(opt, val) => opt.value === val?.value}
          value={selectedOption}
          onChange={(e, newValue) => {
            onChange({
              target: {
                name,
                value: newValue?.value || "",
              },
            });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              required={required}
              placeholder={placeholder}
              name={name}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  height: "48px",
                },
              }}
            />
          )}
        />
      ) : (
        <FormControl fullWidth required={required}>
          <Select
            name={name}
            value={value || ""}
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
      )}
    </Box>
  );
}
