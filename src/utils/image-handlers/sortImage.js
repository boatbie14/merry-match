export function sortImages(images) {
  const filtered = images.filter(item => item.src && item.src !== "");

  const result = [...filtered];

  while (result.length < 5) {
    result.push({ id: `img${result.length + 1}`, src:"" });
  }
  return result;
}