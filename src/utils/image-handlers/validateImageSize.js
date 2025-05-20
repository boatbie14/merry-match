export function validateImageSize(images, sizeLimitMB) {
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    if (image.file && image.file.size > sizeLimitMB * 1024 * 1024) {
      return {
        overLimit: true,
        index: i,
        name: image.file.name,
        sizeMB: (image.file.size / (1024 * 1024)).toFixed(2)
      };
    }
  }
  return { overLimit: false };
}