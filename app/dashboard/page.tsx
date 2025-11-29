import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerComponentClient } from "@/lib/supabase-server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Briefcase } from "lucide-react";
import { JobCard } from "@/components/JobCard";

export default async function DashboardPage() {
  const supabase = await createServerComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching jobs:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-gray-600 mt-1">
            Manage your job applications and generate cover letters
          </p>
        </div>
        <Link href="/dashboard/jobs">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Job
          </Button>
        </Link>
      </div>

      {!jobs || jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
            <CardTitle className="mb-2">No jobs yet</CardTitle>
            <CardDescription className="mb-4">
              Add your first job to start generating cover letters
            </CardDescription>
            <Link href="/dashboard/jobs">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Job
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}


