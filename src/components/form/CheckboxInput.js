// components/CustomCheckbox.js
import { Checkbox, FormControlLabel, FormGroup, styled } from "@mui/material";
import { forwardRef } from "react";
import { IoCheckmarkSharp } from "react-icons/io5";

// สร้างคอมโพเนนต์ CheckIcon เอง
const CheckIcon = forwardRef((props, ref) => {
  return (
    <IoCheckmarkSharp
      ref={ref}
      {...props}
      style={{
        fontSize: "16px",
        color: "#FFFFFF",
      }}
    />
  );
});
CheckIcon.displayName = "CheckIcon";

// Custom styled Checkbox
const CheckboxInput = styled(Checkbox)(({ theme }) => ({
  padding: 0,
  borderRadius: "8px",
  width: "24px",
  height: "24px",
  "&.MuiCheckbox-root": {
    color: "transparent",
    backgroundColor: "#FFFFFF",
    border: "1.5px solid #D6D9E4",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#FFFFFF",
      border: "1.5px solid #A62D82",
      borderRadius: "8px",
    },
  },
  "&.Mui-checked": {
    color: "#FFFFFF",
    backgroundColor: "#A62D82",
    border: "1.5px solid #A62D82",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#A62D82",
      border: "1.5px solid #A62D82",
    },
  },
  "&.Mui-disabled": {
    color: "transparent",
    backgroundColor: "#F2F2F7",
    border: "1.5px solid #D6D9E4",
    borderRadius: "8px",
    opacity: 0.5,
  },
  "&.Mui-disabled.Mui-checked": {
    color: "#FFFFFF",
    backgroundColor: "#A62D82",
    opacity: 0.5,
  },
  "&.MuiFormControlLabel-root": {
    marginLeft: "0px",
  },
}));

// Custom styled FormGroup with gap
const StyledFormGroup = styled(FormGroup)({
  display: "flex",
  flexDirection: "column",
  gap: "16px", // กำหนดระยะห่างระหว่าง checkbox 16px
});

// Export named exports for additional components
export { CheckIcon, StyledFormGroup };

// Export CustomCheckbox as default
export default CheckboxInput;
