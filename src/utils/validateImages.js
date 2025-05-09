export function validateImages(images) {
    const uploaded = images.filter((img) => img.src);
    const hasAvatar = !!images[0]?.src;
  
    if (uploaded.length < 2) {
      return "Please upload at least 2 photos.";
    }
    if (!hasAvatar) {
      return "The first image must be your profile picture.";
    }
  
    return null;
  }
  