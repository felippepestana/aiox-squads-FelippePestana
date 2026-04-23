import { redirect } from "next/navigation";

export default function RootPage() {
  // In local dev without Supabase, go straight to dashboard
  if (process.env.NODE_ENV === "development") {
    redirect("/dashboard");
  }
  redirect("/login");
}
