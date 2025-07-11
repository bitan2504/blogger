import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloud = async (localFilePath: string) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    if (!localFilePath) {
      console.error(`File path not available`);
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(
      `File uploaded successfully on cloud. Cloud link: ${response.url}`
    );
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log(`File uploading failed!`);
    console.error(error);
    fs.unlinkSync(localFilePath);
    throw error;
  } 
};

export default uploadOnCloud;