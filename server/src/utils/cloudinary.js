import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true,
});
// uploadToCloudinary Function Asynchronous function to upload a file (image/video/document) to Cloudinary. Accepts:file → the file path or file buffer options → extra Cloudinary config (overrides default settings)
export const uploadToCloudinary = async (file, options = {}) => {
  try {
    const defaultOptions = {
      folder: "Clinicare", //saves uploads inside a Cloudinary folder called Clinicare.
      resource_type: "auto", //lets Cloudinary auto-detect file type (image, video, pdf, etc.).
      // Image optimization settings
      quality: "auto",
      fetch_format: "auto",
      // Delivery optimization
      eager: [
        { width: 800, height: 600, crop: "limit" },
        { width: 400, height: 300, crop: "limit" },
      ],
      // Performance optimization
      responsive_breakpoints: {
        create_derived: true,
        transformation: {
          quality: "auto:good",
          fetch_format: "auto",
        },
      },
      secure: true,
      optimize: true,
      ...options,
    };

    const uploadResponse = await cloudinary.uploader.upload(
      file,
      defaultOptions
    );
    // Extracts and returns only: secure_url → HTTPS link to access the uploaded file public_id → unique Cloudinary identifier (used for update/delete later)
    return {
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    };
  } catch (error) {
    throw new Error( `Upload failed: ${error.error.message} ` );
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Deletion failed: ${error.error.message} ` )
  }
};

// uploadToCloudinary() → handles uploading, optimization, and responsive delivery.

// deleteFromCloudinary() → removes old files when a user updates/replaces an avatar.