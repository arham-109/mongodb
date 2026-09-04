import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

export const cloudinaryUpload = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      cloudinary.uploader
        .upload(file.path)
        .then((result) => resolve(result));
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
