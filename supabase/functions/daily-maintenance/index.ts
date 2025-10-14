import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";
import { v2 as cloudinary } from "npm:cloudinary";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

cloudinary.config({
  cloud_name: Deno.env.get('CLOUDINARY_CLOUD_NAME') ?? '',
  api_key: Deno.env.get('CLOUDINARY_API_KEY') ?? '',
  api_secret: Deno.env.get('CLOUDINARY_API_SECRET') ?? '',
});

// Helper para extraer public_id desde la URL incluyendo carpeta pawsi
function extractPublicIdFromUrl(urlStr: string): string | null {
  try {
    const u = new URL(urlStr);
    const p = u.pathname; 
    const marker = "/upload/";
    const idx = p.indexOf(marker);
    if (idx === -1) return null;
    let after = p.substring(idx + marker.length); 
    const ver = after.match(/^v\d+\//);
    if (ver) after = after.substring(ver[0].length);
    after = after.replace(/\.[^/.]+$/, ""); 
    return `pawsi/${after}`; 
  } catch (e) {
    return null;
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting daily maintenance job...');

    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    // 1. Send renewal reminders
    const { data: expiringLostPosts } = await supabase
      .from('lost_posts')
      .select('id, title, user_id, expires_at, images, images_public_ids')
      .eq('status', 'active')
      .lte('expires_at', twoDaysFromNow.toISOString())
      .gt('expires_at', new Date().toISOString());

    const { data: expiringReportedPosts } = await supabase
      .from('reported_posts')
      .select('id, title, user_id, expires_at, images, images_public_ids')
      .eq('status', 'active')
      .lte('expires_at', twoDaysFromNow.toISOString())
      .gt('expires_at', new Date().toISOString());

    const expiringPosts = [
      ...(expiringLostPosts || []).map(p => ({ ...p, type: 'lost' })),
      ...(expiringReportedPosts || []).map(p => ({ ...p, type: 'reported' }))
    ];

    for (const post of expiringPosts) {
      await supabase.from('notifications').insert({
        user_id: post.user_id,
        type: 'renewal_reminder',
        message: `Tu publicación "${post.title || post.id}" expira pronto.`,
        meta: { post_type: post.type, post_id: post.id, expires_at: post.expires_at }
      });

      const { data: userData } = await supabase.auth.admin.getUserById(post.user_id);
      if (userData?.user?.email) {
        await resend.emails.send({
          from: "Pawsi <noreply@pawsi.com>",
          to: [userData.user.email],
          subject: "Tu publicación expira pronto — Pawsi",
          html: `<p>Tu publicación "${post.title || post.id}" expira el ${new Date(post.expires_at).toLocaleDateString('es-AR')}.</p>`
        });
      }
    }

    // 2. Delete expired posts
    const now = new Date().toISOString();

    async function deleteImages(post: any) {
      if (!post.images || !Array.isArray(post.images)) return;
      for (let i = 0; i < post.images.length; i++) {
        const publicId = post.images_public_ids?.[i] ?? extractPublicIdFromUrl(post.images[i]);
        if (!publicId) {
          console.warn("No se pudo extraer public_id de", post.images[i]);
          continue;
        }
        console.log("Borrando en Cloudinary public_id:", publicId);
        try {
          const res = await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
          console.log("Resultado:", res);
        } catch (err) {
          console.error("Error borrando imagen:", publicId, err);
        }
      }
    }

    async function deleteExpiredPosts(table: string) {
      const { data: expiredPosts } = await supabase
        .from(table)
        .select('id, title, user_id, images, images_public_ids')
        .eq('status', 'active')
        .lt('expires_at', now);

      if (!expiredPosts) return;

      for (const post of expiredPosts) {
        await deleteImages(post);

        await supabase.from(table).delete().eq('id', post.id);
        await supabase.from('notifications').insert({
          user_id: post.user_id,
          type: 'post_deleted',
          message: `Tu publicación "${post.title || post.id}" fue eliminada automáticamente.`,
          meta: { post_type: table === 'lost_posts' ? 'lost' : 'reported', post_id: post.id, reason: 'expired' }
        });
        await supabase.from('deletion_logs').insert({
          content_type: table === 'lost_posts' ? 'lost' : 'reported',
          content_id: post.id,
          deleted_by: 'system:expired',
          processed: true
        });
      }
    }

    await deleteExpiredPosts('lost_posts');
    await deleteExpiredPosts('reported_posts');

    console.log('Daily maintenance job completed successfully');

    return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });

  } catch (err) {
    console.error('Error en daily maintenance:', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { headers: corsHeaders });
  }
};

serve(handler);


