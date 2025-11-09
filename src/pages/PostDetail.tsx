import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowLeft, MapPin, Flag, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MapboxPreview } from "@/components/MapboxPreview";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { SensitiveImage } from "@/components/SensitiveImage";
import { ReportDialog } from "@/components/ReportDialog";
import { ImageLightbox } from "@/components/ImageLightbox";
import { ContactOptions } from "@/components/ContactOptions";
import { PostActions } from "@/components/PostActions";
import { App } from "@capacitor/app";

interface PostData {
  id: string;
  title: string;
  description?: string;
  species?: string;
  breed?: string;
  age?: string;
  images?: string[];
  location_text?: string;
  location_lat?: number;
  location_lng?: number;
  created_at: string;
  lost_at?: string;
  seen_at?: string;
  state?: string;
  status?: string;
  user_id?: string;
  category?: string;
  condition?: string;
  price?: number;
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  services?: string[];
  product_link?: string | null;
  store_link?: string | null;
  province?: string;
  country?: string;
}

interface ContactInfo {
  contact_email?: string;
  contact_phone?: string;
  contact_whatsapp?: string;
  store_contact?: string;
}

export default function PostDetail() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [post, setPost] = useState<PostData | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingContact, setLoadingContact] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const firstImageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = App.addListener("backButton", (event) => {
      event.stopImmediatePropagation();
      const fromExternal = !(location.state as any)?.from;
      if (fromExternal) {
        window.location.href = "/";
      } else {
        if (window.history.length > 1) navigate(-1);
        else navigate("/", { replace: true });
      }
    });

    return () => handler.remove();
  }, [navigate, location.state]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!type || !id) return;

      const cacheKey = `post_${type}_${id}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setPost(JSON.parse(cached));
        setLoading(false);
        return;
      }

      try {
        let data, error;
        switch (type) {
          case "lost":
            ({ data, error } = await supabase.from("lost_posts").select("*").eq("id", id).eq("status", "active").single());
            break;
          case "reported":
            ({ data, error } = await supabase.from("reported_posts").select("*").eq("id", id).eq("status", "active").single());
            break;
          case "adoption":
            ({ data, error } = await supabase.from("adoption_posts").select("*").eq("id", id).eq("status", "active").single());
            break;
          case "classifieds":
            ({ data, error } = await supabase.from("classifieds").select("*").eq("id", id).eq("status", "active").single());
            break;
          case "veterinarians":
            ({ data, error } = await supabase.from("veterinarians").select("*").eq("id", id).eq("status", "active").single());
            if (data) data.title = data.name;
            break;
          default:
            throw new Error("Invalid post type");
        }

        if (error) throw error;
        if (data) {
          setPost(data);
          localStorage.setItem(cacheKey, JSON.stringify(data));
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({ title: "Error", description: "No se pudo cargar el post", variant: "destructive" });
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [type, id, navigate, toast]);

  useEffect(() => {
    if (!loading && firstImageRef.current) {
      const fromExternal = !(location.state as any)?.from;
      if (fromExternal) {
        firstImageRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [loading, location.state]);

  const loadContactInfo = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para ver la información de contacto.",
        variant: "destructive",
      });
      return;
    }

    if (!type || !id) return;

    const cacheKey = `contact_${type}_${id}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setContactInfo(JSON.parse(cached));
      return;
    }

    setLoadingContact(true);
    try {
      const post_table = type === "classifieds" ? "classifieds" : type === "veterinarians" ? "veterinarians" : `${type}_posts`;
      const { data, error } = await supabase.rpc("get_post_contact_info", { post_table, post_id: id });
      if (error) throw error;
      if (data && data.length > 0) {
        setContactInfo(data[0]);
        sessionStorage.setItem(cacheKey, JSON.stringify(data[0]));
      }
    } catch (error) {
      console.error("Error fetching contact info:", error);
      toast({ title: "Error", description: "No se pudo cargar la información de contacto", variant: "destructive" });
    } finally {
      setLoadingContact(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background animate-pulse"></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center">Post no encontrado</div>;

  const getTypeLabel = () => {
    switch (type) {
      case "lost": return "Perdido";
      case "reported": return "Reportado";
      case "adoption": return "Adopción";
      case "veterinarians": return "Veterinaria";
      case "classifieds": return "Clasificado";
      default: return type;
    }
  };
  const getTypeVariant = () => {
    switch (type) {
      case "lost": return "destructive";
      case "reported": return "default";
      case "adoption": return "secondary";
      case "veterinarians": return "default";
      case "classifieds": return "outline";
      default: return "default";
    }
  };

  // ✅ DELETE REAL — Igual que en Dashboard
  const deletePost = async () => {
    if (!confirm("¿Seguro que quieres borrar el post?")) return;

    try {
      const table =
        type === "classifieds"
          ? "classifieds"
          : type === "veterinarians"
          ? "veterinarians"
          : `${type}_posts`;

      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", post.id);

      if (error) throw error;

      alert("Post eliminado correctamente");
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el post.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">

        {/* ✅ VOLVER + BOTÓN ELIMINAR */}
        <div className="relative mb-4">
          <Button
            variant="ghost"
            onClick={() => {
              const fromExternal = !(location.state as any)?.from;
              if (fromExternal) window.location.href = "/";
              else navigate(location.state?.from || "/", { replace: true });
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver
          </Button>

          {user?.id === post.user_id && (
            <button
              onClick={deletePost}
              className="absolute right-0 top-0 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-md"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>

        <Card className="overflow-hidden">
          {post.images && post.images.length > 0 && (
            <div className="relative" ref={firstImageRef}>
              <Carousel className="w-full">
                <CarouselContent>
                  {post.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div
                        className="relative h-96 w-full overflow-hidden cursor-pointer"
                        onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}
                      >
                        <SensitiveImage
                          src={image.startsWith("http") ? image : `https://jwvcgawjkltegcnyyryo.supabase.co/storage/v1/object/public/posts/${image}`}
                          alt={`${post.title} - Imagen ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          isSensitive={type === "reported" && (post.state === "injured" || post.state === "sick")}
                          loading="lazy"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {post.images.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-4 top-1/2" />
                    <CarouselNext className="absolute right-4 top-1/2" />
                  </>
                )}
              </Carousel>

              <div className="absolute top-4 left-4">
                <Badge variant={getTypeVariant() as any}>{getTypeLabel()}</Badge>
              </div>
            </div>
          )}

          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

            {type === "classifieds" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {post.condition && (
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <p className="font-medium">{post.condition}</p>
                  </div>
                )}
                {post.price !== null && post.price !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">Precio</p>
                    <p className="font-medium">${post.price}</p>
                  </div>
                )}
                {post.location_text && (
                  <div>
                    <p className="text-sm text-muted-foreground">Área</p>
                    <p className="font-medium">{post.location_text}</p>
                  </div>
                )}
              </div>
            )}

            {post.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{post.description}</p>
              </div>
            )}

            {(post.product_link || post.store_link) && (
              <div className="flex flex-col md:flex-row gap-3 mb-6">
                {post.product_link && (
                  <Button asChild variant="default" className="w-full md:w-auto">
                    <a href={post.product_link} target="_blank" rel="noopener noreferrer">
                      Ver producto en tienda
                    </a>
                  </Button>
                )}
                {post.store_link && (
                  <Button asChild variant="outline" className="w-full md:w-auto">
                    <a href={post.store_link} target="_blank" rel="noopener noreferrer">
                      Ir a tienda
                    </a>
                  </Button>
                )}
              </div>
            )}

            <Separator className="my-6" />

            {post.location_lat && post.location_lng && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Ubicación</h2>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {post.location_text}
                </div>
                <MapboxPreview lat={post.location_lat} lng={post.location_lng} height={300} />
              </div>
            )}

            <Separator className="my-6" />

            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Información de contacto</h2>
              <PostActions
                postId={id!}
                postType={type === "classifieds" ? "classified" : (type as any)}
                isHighlighted={isHighlighted}
                onHighlightChange={setIsHighlighted}
              />

              {!contactInfo ? (
                <Button onClick={loadContactInfo} disabled={loadingContact} className="w-full">
                  {loadingContact ? "Cargando..." : "Mostrar información de contacto"}
                </Button>
              ) : (
                <ContactOptions
                  contactInfo={contactInfo}
                  postId={id!}
                  postType={type!}
                  recipientId={post.user_id || ""}
                  postTitle={post.title}
                  loading={loadingContact}
                />
              )}
            </div>
          </div>
        </Card>

        <div className="fixed bottom-6 right-6 z-50">
          <Button variant="destructive" onClick={() => setReportOpen(true)}>
            <Flag className="h-4 w-4 mr-2" /> Reportar publicación
          </Button>
        </div>

        <ReportDialog
          open={reportOpen}
          onOpenChange={setReportOpen}
          postId={post.id}
          postType={type === "classifieds" ? "classified" : (type as any)}
        />

        {post.images && post.images.length > 0 && (
          <ImageLightbox
            images={post.images}
            currentIndex={lightboxIndex}
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            isSensitive={type === "reported" && (post.state === "injured" || post.state === "sick")}
            title={post.title}
          />
        )}
      </div>
    </div>
  );
}














