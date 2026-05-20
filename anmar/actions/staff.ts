"use server";

import { createClient } from "@/lib/supabase/server";
import { staffSchema, type StaffFormValues } from "@/lib/validations/staff";
import type { StaffProfile } from "@/types/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getClinicId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from("staff_profiles")
    .select("clinic_id")
    .eq("user_id", userId)
    .single();
  return (data as Pick<StaffProfile, "clinic_id"> | null)?.clinic_id;
}

export async function createStaff(values: StaffFormValues) {
  const parsed = staffSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { _global: ["Não autenticado"] } };

  const clinic_id = await getClinicId(supabase, user.id);
  if (!clinic_id) return { error: { _global: ["Clínica não encontrada"] } };

  const { error } = await supabase.from("staff_profiles").insert({
    ...parsed.data,
    clinic_id,
    specialties: parsed.data.specialties ?? [],
    active: true,
  } as Omit<StaffProfile, "id" | "created_at" | "updated_at">);

  if (error) {
    if (error.code === "23505") return { error: { cpf: ["CPF já cadastrado nesta clínica"] } };
    return { error: { _global: [error.message] } };
  }

  revalidatePath("/staff");
  redirect("/staff");
}

export async function updateStaff(id: string, values: StaffFormValues) {
  const parsed = staffSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { _global: ["Não autenticado"] } };

  const { error } = await supabase
    .from("staff_profiles")
    .update({ ...parsed.data, specialties: parsed.data.specialties ?? [] })
    .eq("id", id);

  if (error) return { error: { _global: [error.message] } };

  revalidatePath("/staff");
  revalidatePath(`/staff/${id}`);
  redirect(`/staff/${id}`);
}

export async function deactivateStaff(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("staff_profiles").update({ active: false }).eq("id", id);
  revalidatePath("/staff");
  redirect("/staff");
}

export async function loginAction(formData: FormData): Promise<{ error: string } | void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
