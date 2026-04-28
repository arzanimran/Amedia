import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadMedia(filePath: string): Promise<{ url: string; type: string }> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "insta-clone",
    resource_type: "auto", // auto detects image vs video
  });
  return {
    url: result.secure_url,
    type: result.resource_type, // 'image' or 'video'
  };
}

export default cloudinary;