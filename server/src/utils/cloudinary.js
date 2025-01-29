const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const cloudinaryUploadImg = async (filePath) => {
  try {
    if (!filePath) return console.log("local file path not found");
    const res = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(filePath);
    return res;
  } catch (error) {
    fs.unlinkSync(filePath);
    return null;
  }
};

const cloudinaryUploadPrImagesMany = async(files) => {
  try {
    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path, {
          folder: "products",
          resource_type: "auto",
        }, (error, result) => {
          fs.unlinkSync(file.path);
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    return null;
  }
}



const removePrImagesFromCloudinary = async (publicIds) => {
  if (!publicIds || publicIds.length === 0) {
    console.log("No public IDs provided.");
    return [];
  }

  try {
    const result = await cloudinary.api.delete_resources(publicIds, { resource_type: "image" });

    return result;
  } catch (error) {
    console.error("Error deleting images from Cloudinary:", error);
    return null;
  }
};


const RemovecloudinaryExistingImg = async (publicId) => {
  try {
    const res = await cloudinary.uploader
      .destroy(publicId, {
        resource_type: "image",
      })
      .then((res) => {
        console.log("done old img", res);
      })
      .catch((err) => {
        console.log("error old img", err?.message);
      });
  } catch (error) {
    return null;
  }
};

module.exports = { cloudinaryUploadImg, RemovecloudinaryExistingImg,cloudinaryUploadPrImagesMany ,removePrImagesFromCloudinary};
