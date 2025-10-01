import imageCompression from "browser-image-compression";

export const uploadFile = async (file: File): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const baseName = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
  const fileName = `${baseName}.${fileExt}`;

  // 🔧 Opciones de compresión más optimizadas
  const originalOptions = {
    maxSizeMB: 0.15,              
    maxWidthOrHeight: 1280,       
    useWebWorker: true,
    fileType: "image/webp",       
    initialQuality: 0.7,          
    alwaysKeepResolution: false,  
  };

  // Comprimir
  const compressedFile = await imageCompression(file, originalOptions);

  // Subir a Cloudinary
  const formData = new FormData();
  formData.append("file", compressedFile, fileName);
  formData.append("upload_preset", "postspawsi"); // <-- preset

  const cloudName = "dxkjuhdqd"; // <-- cloud name
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dxkjuhdqd/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    throw new Error("Error al subir a Cloudinary");
  }

  const data = await res.json();
  return data.secure_url; // ✅ URL pública de Cloudinary
};

export const uploadFiles = async (files: FileList): Promise<string[]> => {
  const uploadPromises = Array.from(files).map((file) => uploadFile(file));
  return Promise.all(uploadPromises);
};



