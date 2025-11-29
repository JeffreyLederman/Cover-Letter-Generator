import { redirect } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase-server";
import { GenerateLetterContent } from "@/components/GenerateLetterContent";

export default async function GeneratePage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const supabase = await createServerComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("user_id", session.user.id)
    .single();

  if (jobError || !job) {
    redirect("/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  const { data: paragraphs } = await supabase
    .from("paragraphs")
    .select("*")
    .eq("user_id", session.user.id);

  return (
    <GenerateLetterContent
      job={job}
      profile={profile}
      paragraphs={paragraphs || []}
      userId={session.user.id}
    />
  );
}


