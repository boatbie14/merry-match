import React, { useState, useContext, useEffect } from "react";
import CheckboxInput, { CheckIcon, StyledFormGroup } from "../form/CheckboxInput";
import { FormControlLabel, Box } from "@mui/material";
import AgeRangeInput from "../form/SelectAgeRange";
import { MatchContext } from "@/context/MatchContext";

export default function MatchingRightColumn() {
  // สมมติว่าเรามี Context สำหรับเก็บสถานะ Match
  const { setUserFilters, resetUsers } = useContext(MatchContext);

  // Gender interests state
  const [genderInterests, setGenderInterests] = useState({
    men: false,
    women: false,
    nonBinary: false,
    everyone: true, // กำหนดค่าเริ่มต้นเป็น everyone
  });

  // Age range state
  const [ageRange, setAgeRange] = useState([18, 80]);

  // เก็บค่า preference ที่จะส่งไปยัง API
  const [preference, setPreference] = useState("everyone");

  // Effect สำหรับจัดการกับการเลือก gender interests
  useEffect(() => {
    // ตรวจสอบว่าไม่มีการเลือก gender ใดเลย ให้กำหนดเป็น everyone
    const noSelections = !genderInterests.men && !genderInterests.women && !genderInterests.nonBinary;

    if (noSelections) {
      setPreference("everyone");
      return;
    }

    // ถ้าเลือกทุกเพศ ให้กำหนดเป็น everyone
    if (genderInterests.men && genderInterests.women && genderInterests.nonBinary) {
      setPreference("everyone");
      return;
    }

    // ถ้าเลือกเฉพาะ men
    if (genderInterests.men && !genderInterests.women && !genderInterests.nonBinary) {
      setPreference("men");
      return;
    }

    // ถ้าเลือกเฉพาะ women
    if (!genderInterests.men && genderInterests.women && !genderInterests.nonBinary) {
      setPreference("women");
      return;
    }

    // ถ้าเลือกเฉพาะ non-binary
    if (!genderInterests.men && !genderInterests.women && genderInterests.nonBinary) {
      setPreference("non-binary");
      return;
    }

    // ถ้ามีการเลือกหลายตัวเลือก ให้เป็น everyone
    setPreference("everyone");
  }, [genderInterests]);

  const handleGenderInterestChange = (e) => {
    const { name, checked } = e.target;

    // ถ้าผู้ใช้พยายามยกเลิกทุกตัวเลือก ให้ตรวจสอบว่าตัวเลือกนี้ยังถูกเลือกอยู่หรือไม่
    const currentlySelected = genderInterests[name];
    const otherSelections = Object.entries(genderInterests)
      .filter(([key]) => key !== name)
      .some(([, value]) => value);

    // ถ้าไม่มีตัวเลือกอื่นที่ถูกเลือก และผู้ใช้พยายามยกเลิกตัวเลือกนี้ด้วย
    // ให้ทำการตั้งค่าตัวเลือกนี้เป็น true (ไม่อนุญาตให้ยกเลิกทุกตัวเลือก)
    if (!otherSelections && currentlySelected && !checked) {
      // ไม่ทำอะไร - ยังคงเลือกตัวเลือกนี้อยู่
      return;
    }

    setGenderInterests({
      ...genderInterests,
      [name]: checked,
    });
  };

  const handleAgeRangeChange = (newValue) => {
    setAgeRange(newValue);
  };

  // ฟังก์ชันสำหรับล้างตัวกรอง
  const handleClear = () => {
    setGenderInterests({
      men: false,
      women: false,
      nonBinary: false,
      everyone: true,
    });
    setAgeRange([18, 80]);

    // รีเซ็ตข้อมูลใน Context และโหลดข้อมูลใหม่
    resetUsers();
  };

  // ฟังก์ชันสำหรับค้นหาด้วยตัวกรองที่กำหนด
  const handleSearch = () => {
    // สร้าง age_range แบบ string (เช่น "18-80")
    const ageRangeString = `${ageRange[0]}-${ageRange[1]}`;

    // ส่งค่าตัวกรองไปยัง Context
    setUserFilters({
      sexual_preference: preference,
      age_range: ageRangeString,
    });
  };

  return (
    <>
      <form className="flex flex-col justify-between min-h-[100vh]" onSubmit={(e) => e.preventDefault()}>
        <div className="px-6 pt-6">
          <h2 className="text-2xl text-[#2A2E3F] font-bold pb-4">Gender you interest</h2>

          <StyledFormGroup>
            <FormControlLabel
              control={
                <CheckboxInput
                  name="men"
                  checked={genderInterests.men}
                  onChange={handleGenderInterestChange}
                  icon={<span />}
                  checkedIcon={<CheckIcon />}
                />
              }
              label="Men"
              sx={{
                marginLeft: 0,
                "& .MuiFormControlLabel-label": {
                  ml: 1,
                  color: "#111827",
                  fontSize: "16px",
                },
              }}
            />

            <FormControlLabel
              control={
                <CheckboxInput
                  name="women"
                  checked={genderInterests.women}
                  onChange={handleGenderInterestChange}
                  icon={<span />}
                  checkedIcon={<CheckIcon />}
                />
              }
              label="Women"
              sx={{
                marginLeft: 0,
                "& .MuiFormControlLabel-label": {
                  ml: 1,
                  color: "#111827",
                  fontSize: "16px",
                },
              }}
            />

            <FormControlLabel
              control={
                <CheckboxInput
                  name="nonBinary"
                  checked={genderInterests.nonBinary}
                  onChange={handleGenderInterestChange}
                  icon={<span />}
                  checkedIcon={<CheckIcon />}
                />
              }
              label="Non-binary"
              sx={{
                marginLeft: 0,
                "& .MuiFormControlLabel-label": {
                  ml: 1,
                  color: "#111827",
                  fontSize: "16px",
                },
              }}
            />
          </StyledFormGroup>

          <Box sx={{ mt: 4 }}>
            <h2 className="text-2xl text-[#2A2E3F] font-bold pb-4">Age Range</h2>
            <AgeRangeInput value={ageRange} onChange={handleAgeRangeChange} min={18} max={80} step={1} />
          </Box>
        </div>

        <div className="flex flex-row justify-center gap-4 py-6 border-t-1 border-t-[#E4E6ED]">
          <button type="button" className="ghost-btn" onClick={handleClear}>
            Clear
          </button>
          <button type="button" className="primary-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </form>
    </>
  );
}
