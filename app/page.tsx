"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles, Zap, Shield } from "lucide-react";
import { createClientComponentClient } from "@/lib/supabase";

export default function HomePage() {
  const [session, setSession] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, [supabase]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Cover Letter Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create professional, personalized cover letters in minutes with AI.
            Match your experience to any job description effortlessly.
          </p>
          <div className="flex gap-4 justify-center">
            {session ? (
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/login">Get Started with Google</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Sparkles className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>AI-Powered</CardTitle>
              <CardDescription>
                Advanced AI matches your experience to job requirements
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Beautiful PDFs</CardTitle>
              <CardDescription>
                Professional templates ready to download and send
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Generate personalized letters in seconds, not hours
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your data is encrypted and never shared
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
                <p className="text-gray-600">
                  Upload your resume in PDF or DOCX format. Our system extracts
                  your experience and skills automatically.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Add Your Paragraphs</h3>
                <p className="text-gray-600">
                  Create reusable intro, experience, and conclusion paragraphs
                  that reflect your unique voice and achievements.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Add a Job</h3>
                <p className="text-gray-600">
                  Paste the job description and let our AI analyze the
                  requirements.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Generate & Download</h3>
                <p className="text-gray-600">
                  Choose a template and generate your personalized cover
                  letter. Download as PDF and send it off!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

