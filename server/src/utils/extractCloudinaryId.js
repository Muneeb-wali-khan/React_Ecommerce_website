function extractId(url) {
  const avatar = url?.split("/");
  const publicId = avatar[7]?.split(".");

  return publicId[0];
}

const extractIdProductsImages = (urls) => {
  const images = urls?.map((url) => {
    const avatar = url?.url?.split("/");
    const publicId = avatar[8]?.split(".");
    return `products/${publicId[0]}`;
  });

  return images;
};

module.exports = { extractId, extractIdProductsImages };
