import React, { useEffect, useState } from "react";
import { Browser } from "@capacitor/browser";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { ShieldAlert, ExternalLink, Camera as CameraIcon } from "lucide-react";

export default function DenunciasPage() {
  const [loading, setLoading] = useState(true);

  const FORM_URL = "https://denunciasweb.gob.ar/generica";

  // ✅ Abrir navegador oficial
  const openOfficialForm = async () => {
    await Browser.open({
      url: FORM_URL,
      presentationStyle: "fullscreen",
    });
  };

  // ✅ Cámara
  const openCamera = async () => {
    try {
      await Camera.getPhoto({
        quality: 85,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        saveToGallery: true,
        allowEditing: false,
      });

      alert("✅ Foto guardada en tu galería. Luego puedes subirla al formulario.");
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#faf8f5]">

      {/* ✅ Header */}
      <div className="p-4 border-b bg-white shadow-sm flex items-center gap-2">
        <ShieldAlert className="text-red-600" size={22} />
        <h1 className="text-lg font-semibold">Denunciar Maltrato Animal</h1>
      </div>

      {/* ✅ Botón redondo de cámara */}
      <div className="w-full flex justify-center py-4 bg-white border-b">
        <button
          onClick={openCamera}
          className="
            w-20 h-20 
            rounded-full 
            bg-blue-600 
            flex items-center justify-center 
            shadow-lg 
            active:scale-95 
            transition 
            duration-150
          "
        >
          <CameraIcon className="w-9 h-9 text-white" />
        </button>
      </div>

      {/* ✅ Texto debajo del botón */}
      <div className="px-4 pb-4 text-center text-sm text-gray-700">
        Toma fotos o videos del suceso a denunciar
      </div>

      {/* ✅ Advertencias */}
      <div className="p-4 bg-yellow-50 border-b border-yellow-200 text-sm leading-snug">
        <p className="font-semibold text-yellow-800 mb-1">⚠ Importante</p>
        <ul className="list-disc ml-4 text-yellow-800">
          <li>El formulario pertenece al Ministerio Público Fiscal.</li>
          <li>Pawsi <strong>no almacena</strong> tus datos ni los del formulario.</li>
          <li>La información va directo al <strong>MPF</strong>.</li>
          <li>Si no carga, usa el botón inferior.</li>
        </ul>
      </div>

      {/* ✅ WebView / iframe */}
      <div className="flex-1 overflow-hidden relative">

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#faf8f5]">
            <p className="text-gray-500 text-sm">Cargando formulario...</p>
          </div>
        )}

        <iframe
          src={FORM_URL}
          title="Formulario de denuncia"
          className="w-full h-full border-0"
          onLoad={() => setLoading(false)}
        />
      </div>

      {/* ✅ Botón de fallback */}
      <div className="p-4 border-t bg-white">
        <button
          onClick={openOfficialForm}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl text-sm font-semibold shadow"
        >
          <ExternalLink size={18} />
          Si tienes problemas, abrir formulario oficial del MPF
        </button>
      </div>

    </div>
  );
}


