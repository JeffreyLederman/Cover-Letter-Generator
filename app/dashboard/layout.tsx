import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerComponentClient } from "@/lib/supabase-server";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Briefcase,
  User,
  LogOut,
  FileCheck,
  Upload,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
          <div className="mb-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Cover Letter
              </span>
            </Link>
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                asChild
              >
                <span>
                  <Briefcase className="h-4 w-4" />
                  My Jobs
                </span>
              </Button>
            </Link>
            <Link href="/dashboard/letters">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                asChild
              >
                <span>
                  <FileCheck className="h-4 w-4" />
                  Generated Letters
                </span>
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                asChild
              >
                <span>
                  <User className="h-4 w-4" />
                  Profile & API Key
                </span>
              </Button>
            </Link>
          </nav>

          <Separator className="my-6" />

          <SignOutButton />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

