import imageCompression from "browser-image-compression";

/**
 * Detectar si es iOS (Safari o app WebView)
 */
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

/**
 * Sube una sola imagen a Cloudinary, devuelve su URL optimizada y su public_id.
 */
export const uploadFile = async (
  file: File
): Promise<{ secure_url: string; public_id: string }> => {
  const fileExt = file.name.split(".").pop();
  const baseName = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
  const fileName = `${baseName}.${fileExt}`;

  // ✅ Opciones optimizadas según dispositivo
  const optionsIOS = {
    maxSizeMB: 0.20,
    maxWidthOrHeight: 1280,   // ✅ antes 1600 → reduce mucho el peso
    useWebWorker: true,
    fileType: "image/jpeg",   // ✅ Safari lo maneja muchísimo mejor
    initialQuality: 0.80,     // ✅ antes 0.85 → baja peso sin perder calidad visible
  };

  const optionsAndroid = {
    maxSizeMB: 0.15,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
    fileType: "image/webp",   // ✅ Android optimiza WebP perfecto
    initialQuality: 0.7,
  };

  const selectedOptions = isIOS ? optionsIOS : optionsAndroid;

  // ✅ Compresión según dispositivo
  const compressedFile = await imageCompression(file, selectedOptions);

  // ✅ Subir a Cloudinary
  const formData = new FormData();
  formData.append("file", compressedFile, fileName);
  formData.append("upload_preset", "postspawsi");

  const cloudName = "dxkjuhdqd";

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Error al subir a Cloudinary (${res.status}): ${errorText}`);
  }

  const data = await res.json();

  /**
   * ✅ URL final optimizada:
   *  - f_auto          → formato según dispositivo
   *  - q_auto:low      → calidad automática baja (sin perder nitidez)
   */
  const optimizedUrl = data.secure_url.replace(
    "/upload/",
    "/upload/f_auto,q_auto:low/"
  );

  return {
    secure_url: optimizedUrl,
    public_id: data.public_id,
  };
};

/**
 * Retrocompatible:
 * Sube múltiples imágenes y devuelve solo sus URLs optimizadas.
 */
export const uploadFiles = async (files: FileList): Promise<string[]> => {
  const results = await Promise.all(Array.from(files).map((f) => uploadFile(f)));
  return results.map((r) => r.secure_url);
};

/**
 * Nueva versión que también devuelve public_ids.
 */
export const uploadFilesWithIds = async (
  files: FileList
): Promise<{ urls: string[]; public_ids: string[] }> => {
  const results = await Promise.all(Array.from(files).map((f) => uploadFile(f)));
  return {
    urls: results.map((r) => r.secure_url),
    public_ids: results.map((r) => r.public_id),
  };
};




