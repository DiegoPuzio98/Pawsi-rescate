import React, { useEffect, useState } from "react";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { ShieldAlert, ExternalLink, Camera as CameraIcon, Info } from "lucide-react";

export default function DenunciasPage() {
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const isNative = Capacitor.getPlatform() !== "web";
  const FORM_URL = "https://denunciasweb.gob.ar/generica";

  const openOfficialForm = async () => {
    await Browser.open({
      url: FORM_URL,
      presentationStyle: "fullscreen",
    });
  };

  const openCamera = async () => {
    try {
      await Camera.getPhoto({
        quality: 85,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        saveToGallery: true,
        allowEditing: false,
      });
      alert(
        "✅ Foto tomada y guardada en tu galería. Puedes tomar todas las fotos que quieras."
      );
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const infoPoints = [
    {
      sectionTitle: "¿Qué necesito para denunciar?",
      sectionSubtitle: "Documentación y pruebas",
      points: [
        "📸 Toma fotos claras del maltrato: intenta mostrar bien el estado del animal y la situación, y guarda las fotos en tu galería. Pueden ser útiles para la investigación.",
        "👥 Reúne al menos 2 testigos: anota sus nombres y datos de contacto. Ellos deberán acudir a la comisaría con DNI si es necesario.",
        "📝 Anota información del agresor: nombre, descripción física, domicilio o cualquier referencia que pueda ayudar a identificarlo.",
      ],
    },
    {
      sectionTitle: "Canales de denuncia",
      sectionSubtitle: "Dónde denunciar",
      points: [
         "💻 Virtualmente: A través del formulario señalado en esta sección.",
        "🏢 Presencialmente: podés denunciar en la comisaría más cercana al lugar donde ocurrió el hecho (esto es importante porque la jurisdicción puede afectar la rapidez de la investigación). También podés acudir directamente a la Fiscalía/UFI.",
        "🚨 En caso de emergencia: si el maltrato está ocurriendo en este momento y la vida del animal corre peligro, llamá al 911 para que intervenga un móvil policial.",
      ],
    },
    {
      sectionTitle: "¿Qué pasa después de denunciar?",
      sectionSubtitle: "Consideraciones y seguimiento",
      points: [
        "📝 Después de realizar la denuncia virtualmente, recibirás un código. Anótalo, ya que con él podrás realizar un seguimiento del estado del trámite.",
        "📄 Solicita una copia de tu denuncia al momento de presentarla si lo haces presencialmente. Esto te permitirá hacer seguimiento del caso.",

      ],
    },
    {
              sectionTitle: "Investigación y avance de la causa",
      sectionSubtitle: "¿Toda denuncia deriva en un juicio?",
      points: [
        "⚖️ Solo denunciar no garantiza que se actúe rápido: En algunos casos, la fiscalía puede actuar de oficio, pero en general, si no hay querellante o pruebas adicionales, el caso puede ser archivado.",
        "🧑‍⚖️Si deseas que la causa avance, puedes presentarte como querellante luego de haber realizado la denuncia. Esto te permite participar activamente en la investigación, solicitar información y medidas judiciales contra el acusado.",
        "⚖️Si quieres presentarte como querellante, debes comunicarte con la fiscalía a cargo de la causa. Utiliza el número de seguimiento de tu denuncia para saber cuál es.",
        "👥Antes de presentarte como querellante o involucrarte judicialmente, consulta a un abogado para asesorarte.",
        "❌ No confrontes ni amenaces al agresor: esto podría poner en riesgo tu seguridad y afectar la investigación.",
      ],
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#faf8f5]">

      {/* Header */}
      <div className="p-4 border-b bg-white shadow-sm flex items-center gap-2">
        <ShieldAlert className="text-red-600" size={22} />
        <h1 className="text-lg font-semibold">Denunciar Maltrato Animal</h1>
      </div>

      {/* Recuadro superior */}
      <div
        className={`bg-white mx-4 my-4 rounded-lg shadow p-4 flex ${
          isNative ? "flex-col gap-4 h-[60%]" : "flex-row gap-4"
        }`}
      >
        {/* Botón cámara y botón info */}
        <div className={`flex-shrink-0 flex flex-col items-center gap-4 ${isNative ? "w-full" : ""}`}>
          <button
            onClick={openCamera}
            className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-lg active:scale-95 transition duration-150"
          >
            <CameraIcon className="w-9 h-9 text-white" />
          </button>
          <div className="text-sm text-gray-700 text-center mt-2">
            Toma fotos del suceso
          </div>

          <button
            onClick={() => setShowInfo(true)}
            className="mt-2 w-40 bg-green-600 text-white py-2 rounded-lg shadow text-sm font-semibold hover:bg-green-700 transition flex items-center justify-center gap-1"
          >
            <Info size={16} /> LEER ANTES DE DENUNCIAR
          </button>
        </div>

        {/* Advertencias */}
        <div
          className={`flex-1 bg-yellow-50 border border-yellow-200 text-sm leading-snug p-3 rounded-md overflow-auto ${
            isNative ? "w-full h-full" : ""
          }`}
        >
          <p className="font-semibold text-yellow-800 mb-1">⚠ Importante</p>
          <ul className="list-disc ml-4 text-yellow-800">
            <li>El formulario pertenece al Ministerio Público Fiscal.</li>
            <li>Pawsi <strong>no almacena</strong> tus datos ni los del formulario.</li>
            <li>La información va directo al <strong>MPF</strong>.</li>
            <li>Si no carga, usa el botón inferior (o el botón único en app nativa).</li>
          </ul>
        </div>
      </div>

      {/* Web iframe */}
      {!isNative && (
        <div className="flex-1 overflow-hidden relative mx-4 rounded-md shadow">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#faf8f5] rounded-md">
              <p className="text-gray-500 text-sm">Cargando formulario...</p>
            </div>
          )}
          <iframe
            src={FORM_URL}
            title="Formulario de denuncia"
            className="w-full h-full border-0 rounded-md"
            onLoad={() => setLoading(false)}
          />
        </div>
      )}

      {/* Botón abrir formulario */}
      <div className="p-4 bg-white mx-4 mb-4 rounded-md">
        <button
          onClick={openOfficialForm}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl text-sm font-semibold shadow"
        >
          <ExternalLink size={18} />
          Abrir formulario en web oficial
        </button>
      </div>

      {/* Modal info */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80%] overflow-y-auto p-4 relative">
        <h2 className="text-lg font-semibold mb-4 text-center">
  Lo que debes saber
</h2>
            {infoPoints.map((section, idx) => (
              <div key={idx} className="mb-4">
                <h3 className="font-semibold text-gray-800">{section.sectionTitle}</h3>
                <p className="text-sm text-gray-600 mb-2">{section.sectionSubtitle}</p>
                <ul className="list-disc ml-4 space-y-1 text-gray-800">
                  {section.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}







