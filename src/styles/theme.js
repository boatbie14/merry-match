import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D6D9E4", // ปกติ
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D6D9E4", // hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#A62D82", // focused
            borderWidth: "1px",
          },
        },
        input: {
          padding: "12px 14px 16px 14px",
        },
      },
    },
  },
});

export default theme;
