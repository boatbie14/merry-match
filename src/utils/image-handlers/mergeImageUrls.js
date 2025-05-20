export const mergeAndSortImageUrls = (imageUrls, images) => {
  const imageKeys = [
    'profile_image_url',
    'image2_url',
    'image3_url',
    'image4_url',
    'image5_url',
  ];

  const validUrls = [];

  imageKeys.forEach((key, index) => {
    const newUrl = imageUrls[key];
    const oldUrl = images[index]?.src;

    if (newUrl && newUrl !== "null") {
      validUrls.push(newUrl);
    } else if (oldUrl && oldUrl !== "null") {
      validUrls.push(oldUrl);
    }
  });

  while (validUrls.length < 5) {
    validUrls.push(null);
  }

  return imageKeys.reduce((acc, key, idx) => {
    acc[key] = validUrls[idx];
    return acc;
  }, {});
};