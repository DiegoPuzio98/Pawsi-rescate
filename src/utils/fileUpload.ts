import imageCompression from "browser-image-compression";

/**
 * Sube una sola imagen a Cloudinary, devuelve su URL pública y su public_id.
 */
export const uploadFile = async (
  file: File
): Promise<{ secure_url: string; public_id: string }> => {
  const fileExt = file.name.split(".").pop();
  const baseName = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
  const fileName = `${baseName}.${fileExt}`;

  // 🔧 Configuración original de compresión (mantiene formato WEBP)
  const originalOptions = {
    maxSizeMB: 0.15,               // peso máximo ~150KB
    maxWidthOrHeight: 1280,        // resolución máxima
    useWebWorker: true,
    fileType: "image/webp",        // siempre subir en formato webp
    initialQuality: 0.7,
    alwaysKeepResolution: false,
  };

  // Comprimir imagen antes de subir
  const compressedFile = await imageCompression(file, originalOptions);

  // Subir a Cloudinary
  const formData = new FormData();
  formData.append("file", compressedFile, fileName);
  formData.append("upload_preset", "postspawsi"); // 🔹 tu preset configurado en Cloudinary

  const cloudName = "dxkjuhdqd"; // 🔹 tu Cloud Name de Cloudinary
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Error al subir a Cloudinary (${res.status}): ${errorText}`);
  }

  const data = await res.json();

  // ✅ Devolvemos la URL pública y el ID interno de Cloudinary
  return {
    secure_url: data.secure_url,
    public_id: data.public_id,
  };
};

/**
 * Versión clásica (retrocompatible):
 * Sube múltiples imágenes y devuelve solo sus URLs.
 * 👉 No rompe el código que ya usa uploadFiles().
 */
export const uploadFiles = async (files: FileList): Promise<string[]> => {
  const results = await Promise.all(Array.from(files).map((f) => uploadFile(f)));
  return results.map((r) => r.secure_url);
};

/**
 * Nueva versión extendida:
 * Sube múltiples imágenes y devuelve tanto URLs como public_ids.
 * 👉 Usala si querés guardar los public_ids en Supabase.
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




