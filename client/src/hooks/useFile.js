import { useState } from "react";


//handles uploading one image file only.
export function useFile() {
  const [selectedFile, setSelectedFile] = useState("");
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const file = e.target.files?.[0]; // pick the first file or  Accepts one image. and (e) is the browser event object, and you use e.target.files to get the file(s) the user selected from the file input.
    // validate size: max 5MB
    if (file && file.size > 5 * 1024 * 1024) {
      setError("File with maximum size of 5MB is allowed");
      return false;
    }
    const validFile = file?.type.startsWith("image/") ;
    if (!validFile) {
      setError("Please upload only image file");
      return false;
    }
    //covert image //to base64 url string
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onerror = () => {
        setError("Error reading file");
      };
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
    }
  };
  return { selectedFile, setSelectedFile, error, handleFile, setError };
}

//handles uploading multiple image/video files.
export function useFiles() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [err, setErr] = useState(null);

  const handleImage = (e) => {
    const files = e.target.files; // all selected files
    if (files) {
      const fileArray = [...Array.from(files ?? [])]; // convert FileList → Array
      const errors = [];
       // Rule 1: Max 10 files
      if (fileArray.length > 10) {
        errors.push("You can only upload up to 10 media files");
        return;
      }
      const validFiles = fileArray.filter((file) => { //if we dont want to specify the file type, we remove the if
        // Rule 2: Accept only images/videos, max size 10MB
        if (
          !file.type.startsWith("image/") &&
          !file.type.startsWith("video/")
        ) {
          errors.push("Please upload only image or video files");
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          errors.push("File size should be less than 10MB");
          return false;
        }
        return true;
      });
      if (errors.length > 0) {
        setErr(errors.join(", "));
        return;
      }
      setSelectedFiles([]);
      setErr(null);
      // Convert valid files → base64 for preview
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedFiles((prev) => [
            ...prev,
            { file, preview: reader.result }, // keep file and base64 preview
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };
  return { selectedFiles, setSelectedFiles, err, setErr, handleImage };
}