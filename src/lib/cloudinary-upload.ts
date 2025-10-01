import imageCompression from "browser-image-compression";

export const uploadFile = async (file: File): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const baseName = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
  const fileName = `${baseName}.${fileExt}`;
  const thumbName = `${baseName}_thumb.${fileExt}`;

  const originalOptions = { maxSizeMB: 1, maxWidthOrHeight: 1280, useWebWorker: true };
  const thumbOptions = { maxSizeMB: 0.2, maxWidthOrHeight: 300, useWebWorker: true };

  const originalFile = await imageCompression(file, originalOptions);
  const thumbFile = await imageCompression(file, thumbOptions);

  const formData = new FormData();
  formData.append("file", originalFile);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append("public_id", fileName);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Error al subir imagen a Cloudinary");

  const thumbForm = new FormData();
  thumbForm.append("file", thumbFile);
  thumbForm.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  thumbForm.append("public_id", thumbName);

  fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: thumbForm,
  }).catch((err) => console.warn("⚠️ Error subiendo thumbnail:", err));

  return data.secure_url;
};

export const uploadFiles = async (files: FileList): Promise<string[]> => {
  return Promise.all(Array.from(files).map((file) => uploadFile(file)));
};

