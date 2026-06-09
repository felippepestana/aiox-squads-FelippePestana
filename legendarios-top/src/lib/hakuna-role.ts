// Server-side helper to fetch the current hakuna's role.
// Wrapped in React.cache() so multiple calls within the same request share the result.

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { HakunaRole } from "@/lib/hakuna-permissions";

export const getHakunaRole = cache(async (): Promise<HakunaRole> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return "apoio";
  const { data } = await supabase
    .from("hakunas")
    .select("role")
    .eq("email", user.email)
    .single();
  return (data?.role ?? "apoio") as HakunaRole;
});
