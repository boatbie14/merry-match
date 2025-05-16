export function calculateAge(birthDate) {
  // ตรวจสอบว่า birthDate เป็น Date Object ที่ถูกต้อง
  if (!(birthDate instanceof Date) || isNaN(birthDate)) {
    return "Invalid birth date";
  }

  const today = new Date();
  const birthYear = birthDate.getFullYear();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  let age = currentYear - birthYear;

  // ตรวจสอบว่าวันเกิดในปีปัจจุบันได้ผ่านพ้นไปแล้วหรือไม่
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    age--;
  }

  return age;
}