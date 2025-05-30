import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import CheckboxInput, { CheckIcon, StyledFormGroup } from "../form/CheckboxInput";
import { FormControlLabel, Box } from "@mui/material";
import AgeRangeInput from "../form/SelectAgeRange";
import { useSwipe } from "@/context/SwipeContext";

const MatchingRightColumn = forwardRef(({ clearCallback, onSearch }, ref) => {
  const { setUserFilters, resetUsers, filters, currentUser } = useSwipe();

  // Gender interests state
  const [genderInterests, setGenderInterests] = useState({
    men: false,
    women: false,
    nonBinary: false,
    everyone: true,
  });

  // Age range state
  const [ageRange, setAgeRange] = useState([18, 80]);

  // เก็บค่า preference ที่จะส่งไปยัง API
  const [preference, setPreference] = useState("everyone");

  // Effect เพื่อจดจำสถานะ checkbox หลังจากการค้นหา
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  // Initial setup - run once when component mounts or when filters/currentUser updates
  useEffect(() => {
    // เมื่อโหลดครั้งแรกหรือเมื่อ currentUser เปลี่ยน ให้ทำการ initialize state
    initializeComponentState();
  }, [filters, currentUser]);

  // Initialize the component's state based on filters or currentUser
  const initializeComponentState = () => {
    // ถ้าเคยค้นหาแล้ว และไม่ใช่การโหลดครั้งแรก ให้คงค่าสถานะไว้
    if (hasSearched && !isInitialLoad) {
      return;
    }

    // ตั้งค่า preference
    let currentPreference = "everyone";

    // ลำดับการใช้ข้อมูล: filters > currentUser > default
    if (filters?.sexual_preference) {
      currentPreference = filters.sexual_preference;
    } else if (currentUser?.sexual_preference) {
      currentPreference = currentUser.sexual_preference;
    }

    // ตั้งค่า checkbox ตาม preference
    if (currentPreference === "everyone") {
      // ถ้าเป็น everyone ให้ตั้งค่าแบบเริ่มต้น
      setGenderInterests({
        men: false,
        women: false,
        nonBinary: false,
        everyone: true,
      });
    } else {
      // ตั้งค่าตาม preference
      setGenderInterests({
        men: currentPreference === "men",
        women: currentPreference === "women",
        nonBinary: currentPreference === "non-binary",
        everyone: currentPreference === "everyone",
      });
    }

    setPreference(currentPreference);

    // ตั้งค่า age range
    if (filters?.age_range) {
      const [min, max] = filters.age_range.split("-").map(Number);
      setAgeRange([min || 18, max || 80]);
    } else {
      setAgeRange([18, 80]);
    }

    // หลังจากโหลดครั้งแรกแล้ว ให้ตั้งค่า isInitialLoad เป็น false
    setIsInitialLoad(false);
  };

  // Effect สำหรับจัดการกับการเลือก gender interests
  useEffect(() => {
    updatePreferenceFromGenderInterests();
  }, [genderInterests]);

  // คำนวณค่า preference จากการเลือก checkbox
  const updatePreferenceFromGenderInterests = () => {
    const { men, women, nonBinary } = genderInterests;

    // ตรวจสอบว่าไม่มีการเลือก gender ใดเลย หรือเลือกทุกเพศ ให้กำหนดเป็น everyone
    const noSelections = !men && !women && !nonBinary;
    const allSelections = men && women && nonBinary;

    if (noSelections || allSelections) {
      setPreference("everyone");
      return;
    }

    // ถ้าเลือกเฉพาะ men
    if (men && !women && !nonBinary) {
      setPreference("men");
      return;
    }

    // ถ้าเลือกเฉพาะ women
    if (!men && women && !nonBinary) {
      setPreference("women");
      return;
    }

    // ถ้าเลือกเฉพาะ non-binary
    if (!men && !women && nonBinary) {
      setPreference("non-binary");
      return;
    }

    // ถ้ามีการเลือกหลายตัวเลือก ให้เป็น everyone
    setPreference("everyone");
  };

  const handleGenderInterestChange = (e) => {
    const { name, checked } = e.target;

    // ตรวจสอบว่าผู้ใช้กำลังพยายามยกเลิกทุกตัวเลือกหรือไม่
    const currentlySelected = genderInterests[name];
    const otherSelections = Object.entries(genderInterests)
      .filter(([key]) => key !== name && key !== "everyone")
      .some(([, value]) => value);

    // ถ้าไม่มีตัวเลือกอื่นที่ถูกเลือก และผู้ใช้พยายามยกเลิกตัวเลือกนี้ด้วย
    // ให้ทำการตั้งค่าตัวเลือกนี้เป็น true (ไม่อนุญาตให้ยกเลิกทุกตัวเลือก)
    if (!otherSelections && currentlySelected && !checked) {
      // ไม่อนุญาตให้ยกเลิกทุกตัวเลือก - คงค่าเดิมไว้
      return;
    }

    setGenderInterests({
      ...genderInterests,
      [name]: checked,
      // ตั้งค่า everyone เป็น false เมื่อมีการเลือกเฉพาะเจาะจง
      everyone: name === "everyone" ? checked : false,
    });
  };

  const handleAgeRangeChange = (newValue) => {
    setAgeRange(newValue);
  };

  const handleClear = () => {
    console.log("handleClear executed inside MatchingRightColumn");
    // ตั้งค่ากลับเป็นค่าเริ่มต้น
    setGenderInterests({
      men: false,
      women: false,
      nonBinary: false,
      everyone: true,
    });

    setAgeRange([18, 80]);
    setPreference("everyone");

    // เมื่อกด Clear ให้รีเซ็ตสถานะการค้นหา
    setHasSearched(false);
    setIsInitialLoad(true);

    // เรียกใช้ resetUsers จาก context
    resetUsers();
  };

  // เปิดเผย method handleClear ให้กับคอมโพเนนต์แม่ผ่าน ref
  useImperativeHandle(ref, () => ({
    handleClear,
  }));

  // ถ้ายังมี clearCallback เดิม ก็ยังคงใช้งานได้
  useEffect(() => {
    if (clearCallback && typeof clearCallback === "function") {
      console.log("Registering handleClear function to parent");
      clearCallback(handleClear);
    }
  }, [clearCallback]);

  const handleSearch = () => {
    // สร้าง age_range แบบ string (เช่น "18-80")
    const ageRangeString = `${ageRange[0]}-${ageRange[1]}`;

    // เมื่อค้นหา ให้ตั้งค่า hasSearched เป็น true
    setHasSearched(true);

    // ส่งค่าตัวกรองไปยัง context
    setUserFilters({
      sexual_preference: preference,
      age_range: ageRangeString,
    });

    // เรียกใช้ onSearch callback ถ้ามี
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <>
      <form className="flex flex-col h-full justify-between" onSubmit={(e) => e.preventDefault()}>
        <div className="px-3 lg:px-6 pt-6">
          <h2 className="md:text-2xl text-[#2A2E3F] font-bold pb-4">Gender you interest</h2>

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
            <h2 className="md:text-2xl text-[#2A2E3F] font-bold md:pb-4">Age Range</h2>
            <AgeRangeInput value={ageRange} onChange={handleAgeRangeChange} min={18} max={80} step={1} />
          </Box>
        </div>

        <div className="w-full block lg:hidden">
          <button type="button" className="primary-btn mt-6 w-full" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="hidden lg:flex md:flex-row md:justify-center md:gap-4 py-6 border-t-1 border-t-[#E4E6ED]">
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
});

MatchingRightColumn.displayName = "MatchingRightColumn";

export default MatchingRightColumn;
