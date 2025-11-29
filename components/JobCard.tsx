"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, ExternalLink, FileText } from "lucide-react";
import { Job } from "@/types";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-600" />
          {job.title}
        </CardTitle>
        <CardDescription>{job.company}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-3">
          {job.description_text.substring(0, 150)}...
        </p>
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/dashboard/generate/${job.id}`}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Letter
            </Link>
          </Button>
          {job.link && (
            <Button variant="outline" size="icon" asChild>
              <a href={job.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


