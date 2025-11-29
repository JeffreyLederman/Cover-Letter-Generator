import { redirect } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase-server";
import { ProfileContent } from "@/components/ProfileContent";

export default async function ProfilePage() {
  const supabase = await createServerComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  const { data: paragraphs } = await supabase
    .from("paragraphs")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your API key, resume, and paragraphs
        </p>
      </div>

      <ProfileContent
        profile={profile}
        paragraphs={paragraphs || []}
        userId={session.user.id}
      />
    </div>
  );
}


