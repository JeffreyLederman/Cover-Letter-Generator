import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerComponentClient } from "@/lib/supabase-server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";
import { format } from "date-fns";

export default async function LettersPage() {
  const supabase = await createServerComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: letters, error } = await supabase
    .from("cover_letters")
    .select("*, jobs(*)")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching letters:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Generated Letters</h1>
        <p className="text-gray-600 mt-1">
          View and download your generated cover letters
        </p>
      </div>

      {!letters || letters.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <CardTitle className="mb-2">No letters yet</CardTitle>
            <CardDescription>
              Generate your first cover letter from a job posting
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {letters.map((letter: any) => (
            <Card key={letter.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  {letter.jobs?.title || "Untitled"}
                </CardTitle>
                <CardDescription>
                  {letter.jobs?.company || "Unknown Company"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(letter.created_at), "MMM d, yyyy")}
                </div>
                {letter.pdf_url && (
                  <Button asChild className="w-full">
                    <a href={letter.pdf_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </a>
                  </Button>
                )}
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/dashboard/generate/${letter.job_id}`}>
                    Regenerate
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


