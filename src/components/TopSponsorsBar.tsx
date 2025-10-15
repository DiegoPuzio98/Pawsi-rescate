import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
}

export const TopSponsorsBar = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true });
      if (error) console.error(error);
      else setSponsors(data || []);
      setLoading(false);
    };
    fetchSponsors();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-background border-t border-border py-6 text-center text-muted-foreground">
        Cargando patrocinadores...
      </div>
    );
  }

  // Duplicamos muchas veces para asegurar que siempre haya contenido visible
  const repeatedSponsors = Array(20).fill(sponsors).flat();

  return (
    <div className="w-full bg-background border-t border-border overflow-hidden py-6">
      <div
        className="flex justify-center py-3 text-xl font-bold text-brown tracking-wider drop-shadow-md"
        style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      >
        NOS APOYAN
      </div>

      <div className="relative overflow-hidden w-full">
        <div
          className="flex gap-10 w-max"
          style={{
            animation: 'scroll 60s linear infinite',
          }}
        >
          {repeatedSponsors.map((sponsor, idx) => (
            <img
              key={`${sponsor.id}-${idx}`}
              src={sponsor.logo_url}
              alt={sponsor.name}
              className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition flex-shrink-0"
              loading="lazy"
              draggable="false"
            />
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}} />
    </div>
  );
};




























