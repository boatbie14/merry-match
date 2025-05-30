export const formatDateToUserTimezone = (isoString) => {
  const date = new Date(isoString);
  if (isNaN(date)) return "Invalid Date";

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // บวก 1 เพราะ getMonth() เริ่มที่ 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};