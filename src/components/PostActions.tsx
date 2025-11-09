import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Flag, Share2 } from "lucide-react";
import { ReportDialog } from "./ReportDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Share } from "@capacitor/share";

interface PostActionsProps {
  postId: string;
  postType: 'adoption' | 'lost' | 'reported' | 'classified';
  contactWhatsapp?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  isHighlighted?: boolean;
  onHighlightChange?: (highlighted: boolean) => void;
}

export function PostActions({ 
  postId, 
  postType, 
  contactWhatsapp,
  contactPhone,
  contactEmail, 
  isHighlighted, 
  onHighlightChange 
}: PostActionsProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [reportOpen, setReportOpen] = useState(false);
  const [highlightLoading, setHighlightLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_PUBLIC_SITE_URL || "https://pawsiapp.com";
  const getPostUrl = () => `${baseUrl}/post/${postType}/${postId}`;

  const handleHighlight = async () => {
    if (!user) {
      toast({ title: "Inicia sesión", description: "Debes iniciar sesión para guardar publicaciones" });
      return;
    }

    setHighlightLoading(true);
    try {
      if (isHighlighted) {
        const { error } = await supabase
          .from('user_highlights')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId)
          .eq('post_type', postType);
        
        if (error) throw error;
        onHighlightChange?.(false);
        toast({ title: "Publicación eliminada de guardados" });
      } else {
        const { error } = await supabase
          .from('user_highlights')
          .insert({
            user_id: user.id,
            post_id: postId,
            post_type: postType
          });
        
        if (error) throw error;
        onHighlightChange?.(true);
        toast({ title: "Publicación guardada" });
      }
    } catch (error: any) {
      console.error('Error managing highlight:', error);
      toast({ title: "Error", description: "No se pudo actualizar el guardado" });
    } finally {
      setHighlightLoading(false);
    }
  };

  const handleContact = () => {
    if (!user) {
      toast({ title: "Inicia sesión", description: "Debes iniciar sesión para contactar al publicador." });
      window.location.href = "/auth";
      return;
    }

    const currentPath = window.location.pathname;
    if (currentPath.includes('/post/')) {
      toast({ title: "Usa las opciones de contacto disponibles en la página" });
    } else {
      window.location.href = `/post/${postType}/${postId}`;
    }
  };

  const handleShare = async () => {
    const url = getPostUrl();

    // 🔹 Intentar usar Capacitor Share primero (móvil)
    try {
      await Share.share({
        title: "Compartir publicación",
        text: "Mirá esta publicación en Pawsi:",
        url,
        dialogTitle: "Compartir publicación"
      });
      return;
    } catch (err) {
      console.debug("Capacitor Share falló o estamos en web:", err);
    }

    // 🔹 Fallback: copiar enlace al portapapeles
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Enlace copiado",
        description: "Podés pegarlo en cualquier app",
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo copiar el enlace",
      });
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Highlight button */}
      <Button 
        size="sm" 
        variant="outline"
        onClick={handleHighlight}
        disabled={highlightLoading}
      >
        <Heart 
          className={`h-4 w-4 mr-1 ${isHighlighted ? 'fill-current text-primary' : ''}`} 
        />
        {isHighlighted ? 'Guardado' : 'Guardar'}
      </Button>

      {/* Report button */}
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => setReportOpen(true)}
      >
        <Flag className="h-4 w-4 mr-1" />
        Reportar
      </Button>

      {/* Share button */}
      <Button
        size="sm"
        variant="outline"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
      </Button>

      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        postId={postId}
        postType={postType}
      />
    </div>
  );
}


