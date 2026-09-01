import { createClient } from "@supabase/supabase-js";

// ⚠️ Ce client utilise la Service Role Key : il ignore le RLS.
// À n'utiliser QUE côté serveur (Server Actions, Route Handlers), jamais côté client.
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_URL manquant dans les variables d'environnement."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
