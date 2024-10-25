import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";

(async function () {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Upload an image

  const uploadOnClouninary = async (localFilePath) => {
    try {
      if (!localFilePath) {
        return null;
      }
      //upload file on cloudinary
      const response = await cloudinary.uploader.upload("localFilePath", {
        resource_type: "auto",
      });
      //file has been uploaded successfully uploaded
      console.log("file is uploaded on cloudinary", response.url);
      return response;
    } catch (error) {
      fs.unlinkSync(localFilePath); // remove the locally saved temporary file as a upload operation get failed
      return null;
    }
  };
});
export { uploadOnClouninary };
