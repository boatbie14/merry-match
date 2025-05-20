// components/AgeRangeInput.js
import React, { useState, useEffect } from "react";
import { Box, Slider, TextField, styled } from "@mui/material";

// Styled Slider component with updated thumb and track sizes
const CustomSlider = styled(Slider)(({ theme }) => ({
  color: "#A62D82",
  height: 3,
  padding: "15px 0",
  "& .MuiSlider-thumb": {
    height: 14,
    width: 14,
    backgroundColor: "#DF89C6",
    border: "2px solid #A62D82",
    "&:focus, &:hover, &.Mui-active": {
      boxShadow: "0 0 0 8px rgba(166, 45, 130, 0.16)",
    },
  },
  "& .MuiSlider-track": {
    height: 3,
    borderRadius: 1.5,
  },
  "& .MuiSlider-rail": {
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#E4E6ED",
  },
}));

// Range labels box
const RangeBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "24px",
  gap: "16px",
}));

// Styled Input for range values
const RangeInput = styled(TextField)({
  "& .MuiInputBase-root": {
    height: 48,
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: 500,
    color: "#6B7280",
    backgroundColor: "#F8F8FB",
    "& fieldset": {
      borderColor: "#E4E6ED",
      borderRadius: "8px",
    },
    "&:hover fieldset": {
      borderColor: "#A62D82",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#A62D82",
      borderWidth: "1px",
    },
    "& input": {
      textAlign: "center",
      padding: "12px 14px",
    },
  },
  width: "128px",
});

const AgeRangeInput = ({ value, onChange, min, max, step }) => {
  // สร้าง state สำหรับ slider (ใช้ค่าจาก parent)
  const [sliderValue, setSliderValue] = useState(value);

  // สร้าง state แยกสำหรับช่องกรอก (ให้พิมพ์ได้โดยอิสระ)
  const [inputMin, setInputMin] = useState(value[0].toString());
  const [inputMax, setInputMax] = useState(value[1].toString());

  // อัพเดท slider และช่องกรอกเมื่อค่า props เปลี่ยน (จาก parent)
  useEffect(() => {
    setSliderValue(value);
    setInputMin(value[0].toString());
    setInputMax(value[1].toString());
  }, [value]);

  // อัพเดทค่าเมื่อ slider เปลี่ยน
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    setInputMin(newValue[0].toString());
    setInputMax(newValue[1].toString());
    onChange(newValue); // ส่งค่าไปที่ parent
  };

  // อัพเดทค่าเมื่อกล่องค่าต่ำสุดเปลี่ยน (เฉพาะ state ภายใน)
  const handleMinInputChange = (event) => {
    setInputMin(event.target.value);
  };

  // อัพเดทค่าเมื่อกล่องค่าสูงสุดเปลี่ยน (เฉพาะ state ภายใน)
  const handleMaxInputChange = (event) => {
    setInputMax(event.target.value);
  };

  // เมื่อออกจากช่องกรอกค่าต่ำสุด ทำการ validate และส่งค่าไปที่ parent
  const handleMinInputBlur = () => {
    let newMinValue = parseInt(inputMin, 10);

    // ตรวจสอบและแก้ไขค่าให้อยู่ในช่วงที่ถูกต้อง
    if (isNaN(newMinValue)) {
      newMinValue = min;
    } else if (newMinValue < min) {
      newMinValue = min;
    } else if (newMinValue > sliderValue[1]) {
      newMinValue = sliderValue[1];
    }

    // อัพเดท state และส่งค่าไปที่ parent
    setInputMin(newMinValue.toString());
    const newValue = [newMinValue, sliderValue[1]];
    setSliderValue(newValue);
    onChange(newValue);
  };

  // เมื่อออกจากช่องกรอกค่าสูงสุด ทำการ validate และส่งค่าไปที่ parent
  const handleMaxInputBlur = () => {
    let newMaxValue = parseInt(inputMax, 10);

    // ตรวจสอบและแก้ไขค่าให้อยู่ในช่วงที่ถูกต้อง
    if (isNaN(newMaxValue)) {
      newMaxValue = max;
    } else if (newMaxValue > max) {
      newMaxValue = max;
    } else if (newMaxValue < sliderValue[0]) {
      newMaxValue = sliderValue[0];
    }

    // อัพเดท state และส่งค่าไปที่ parent
    setInputMax(newMaxValue.toString());
    const newValue = [sliderValue[0], newMaxValue];
    setSliderValue(newValue);
    onChange(newValue);
  };

  // เมื่อกด Enter ในช่องกรอก
  const handleKeyDown = (event, isMin) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (isMin) {
        handleMinInputBlur();
      } else {
        handleMaxInputBlur();
      }
      event.target.blur(); // ออกจากช่องกรอก
    }
  };

  return (
    <Box sx={{ width: "100%", padding: "8px 4px" }}>
      <CustomSlider value={sliderValue} onChange={handleSliderChange} valueLabelDisplay="off" min={min} max={max} step={step} />

      <RangeBox>
        <RangeInput
          variant="outlined"
          value={inputMin}
          onChange={handleMinInputChange}
          onBlur={handleMinInputBlur}
          onKeyDown={(e) => handleKeyDown(e, true)}
          inputProps={{
            type: "number",
            "aria-labelledby": "age-range-min",
          }}
        />
        <Box component="span" sx={{ fontSize: "20px", color: "#6B7280" }}>
          -
        </Box>
        <RangeInput
          variant="outlined"
          value={inputMax}
          onChange={handleMaxInputChange}
          onBlur={handleMaxInputBlur}
          onKeyDown={(e) => handleKeyDown(e, false)}
          inputProps={{
            type: "number",
            "aria-labelledby": "age-range-max",
          }}
        />
      </RangeBox>
    </Box>
  );
};

// Default props
AgeRangeInput.defaultProps = {
  min: 18,
  max: 80,
  step: 1,
};

export default AgeRangeInput;
