import React, { useState, useContext, useEffect } from "react";
import CheckboxInput, { CheckIcon, StyledFormGroup } from "../form/CheckboxInput";
import { FormControlLabel, Box } from "@mui/material";
import AgeRangeInput from "../form/SelectAgeRange";
//#### Edit: เปลี่ยนการ import จาก context/MatchContext เป็นการใช้ hook เอง
import { useMatch } from "@/context/MatchContext";

export default function MatchingRightColumn() {
  //#### Edit: ใช้ hook useMatch เพื่อเข้าถึงฟังก์ชันและข้อมูลจาก context
  const { setUserFilters, resetUsers, filters, currentUser } = useMatch();

  // Gender interests state
  //#### Edit: เริ่มต้นด้วยค่าจาก currentUser, filters หรือค่าเริ่มต้น
  const [genderInterests, setGenderInterests] = useState(() => {
    // ใช้ค่าจาก filters ก่อน (กรณีที่มีการกรองแล้ว)
    if (filters?.sexual_preference) {
      return {
        men: filters.sexual_preference === "men",
        women: filters.sexual_preference === "women",
        nonBinary: filters.sexual_preference === "non-binary",
      };
    }

    // ถ้าไม่มี filters แต่มี currentUser ให้ใช้ค่าจาก currentUser
    if (currentUser?.sexual_preference) {
      return {
        men: currentUser.sexual_preference === "men",
        women: currentUser.sexual_preference === "women",
        nonBinary: currentUser.sexual_preference === "non-binary",
        everyone: currentUser.sexual_preference === "everyone" || !currentUser.sexual_preference,
      };
    }

    // ค่าเริ่มต้นถ้าไม่มีทั้ง filters และ currentUser
    return {
      men: false,
      women: false,
      nonBinary: false,
      everyone: true,
    };
  });

  // Age range state
  //#### Edit: เริ่มต้นด้วยค่าจาก filters หรือค่าเริ่มต้น
  const [ageRange, setAgeRange] = useState(() => {
    if (filters?.age_range) {
      const [min, max] = filters.age_range.split("-").map(Number);
      return [min || 18, max || 80];
    }
    return [18, 80];
  });

  // เก็บค่า preference ที่จะส่งไปยัง API
  //#### Edit: ใช้ค่าเริ่มต้นจาก currentUser หรือ filters
  const [preference, setPreference] = useState(() => {
    if (filters?.sexual_preference) {
      return filters.sexual_preference;
    }
    return currentUser?.sexual_preference || "everyone";
  });

  //#### Add: ใช้ useEffect เพื่ออัพเดท checkbox เมื่อ currentUser โหลดสำเร็จ
  useEffect(() => {
    if (currentUser && !filters?.sexual_preference) {
      // ถ้ามี currentUser แต่ยังไม่มีการกรอง ให้ใช้ค่าจาก currentUser
      const userPreference = currentUser.sexual_preference || "everyone";

      setGenderInterests({
        men: userPreference === "men",
        women: userPreference === "women",
        nonBinary: userPreference === "non-binary",
        everyone: userPreference === "everyone" || !userPreference,
      });

      setPreference(userPreference);

      console.log("Using preferences from current user:", userPreference);
    }
  }, [currentUser, filters]);

  //#### Add: useEffect เพื่ออัพเดท component state เมื่อ filters เปลี่ยน
  useEffect(() => {
    if (filters) {
      // อัพเดท ageRange
      if (filters.age_range) {
        const [min, max] = filters.age_range.split("-").map(Number);
        setAgeRange([min || 18, max || 80]);
      }

      // อัพเดท genderInterests
      if (filters.sexual_preference) {
        setGenderInterests({
          men: filters.sexual_preference === "men",
          women: filters.sexual_preference === "women",
          nonBinary: filters.sexual_preference === "non-binary",
          everyone: filters.sexual_preference === "everyone" || !filters.sexual_preference,
        });

        setPreference(filters.sexual_preference);
      }
    }
  }, [filters]);

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

  //#### Edit: ปรับฟังก์ชันล้างตัวกรองให้ใช้ resetUsers จาก context
  const handleClear = () => {
    // ใช้ค่าเริ่มต้นจาก currentUser หรือค่าเริ่มต้น
    const defaultPreference = currentUser?.sexual_preference || "everyone";

    setGenderInterests({
      men: defaultPreference === "men",
      women: defaultPreference === "women",
      nonBinary: defaultPreference === "non-binary",
      everyone: defaultPreference === "everyone" || !defaultPreference,
    });

    setAgeRange([18, 80]);

    // เรียกใช้ resetUsers จาก context
    resetUsers();
  };

  //#### Edit: ปรับฟังก์ชันค้นหาให้ใช้ setUserFilters จาก context
  const handleSearch = () => {
    // สร้าง age_range แบบ string (เช่น "18-80")
    const ageRangeString = `${ageRange[0]}-${ageRange[1]}`;

    // ส่งค่าตัวกรองไปยัง context
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
