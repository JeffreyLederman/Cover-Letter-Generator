"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClientComponentClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, Download, RefreshCw, Loader2 } from "lucide-react";
import { Job, Profile, Paragraph, TemplateId } from "@/types";
import { CoverLetterPDF } from "@/components/CoverLetterPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";

interface GenerateLetterContentProps {
  job: Job;
  profile: Profile | null;
  paragraphs: Paragraph[];
  userId: string;
}

export function GenerateLetterContent({
  job,
  profile,
  paragraphs,
  userId,
}: GenerateLetterContentProps) {
  const [template, setTemplate] = useState<TemplateId>("classic");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [letterId, setLetterId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const introParagraphs = paragraphs.filter((p) => p.category === "intro");
  const experienceParagraphs = paragraphs.filter(
    (p) => p.category === "experience"
  );
  const conclusionParagraphs = paragraphs.filter(
    (p) => p.category === "conclusion"
  );

  const canGenerate =
    profile?.openai_api_key &&
    introParagraphs.length > 0 &&
    conclusionParagraphs.length > 0;

  const handleGenerate = async () => {
    if (!canGenerate) {
      toast({
        title: "Error",
        description:
          "Please configure your API key and add required paragraphs",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setContent(null);

    try {
      const response = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          templateId: template,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Generation failed");
      }

      const data = await response.json();
      setContent(data.content);
      setLetterId(data.letterId);
      setPdfUrl(data.pdfUrl);

      toast({
        title: "Success",
        description: "Cover letter generated successfully",
      });

      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate cover letter",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Generate Cover Letter</h1>
        <p className="text-gray-600 mt-1">
          {job.title} at {job.company}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap">
                  {job.description_text}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template Selection</CardTitle>
              <CardDescription>
                Choose a header style for your cover letter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={template} onValueChange={(v) => setTemplate(v as TemplateId)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic (Centered)</SelectItem>
                  <SelectItem value="modern">Modern (Left-Right)</SelectItem>
                  <SelectItem value="minimal">Minimal (Clean)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={loading || !canGenerate}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Cover Letter
              </>
            )}
          </Button>

          {!canGenerate && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <p className="text-sm text-yellow-800">
                  Please configure your API key and add at least one intro and
                  one conclusion paragraph in your profile.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          {content && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Generated Letter</CardTitle>
                  <CardDescription>
                    Review and edit the generated content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Content (Markdown)</Label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={20}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    {pdfUrl && (
                      <Button asChild>
                        <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={handleGenerate}
                      disabled={loading}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* PDF Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>PDF Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white">
                    {content && (
                      <PDFDownloadLink
                        document={
                          <CoverLetterPDF
                            content={content}
                            templateId={template}
                            jobTitle={job.title}
                            company={job.company}
                          />
                        }
                        fileName={`cover-letter-${job.company}-${Date.now()}.pdf`}
                      >
                        {({ loading: pdfLoading }) =>
                          pdfLoading ? (
                            <div className="flex items-center justify-center h-96">
                              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
                              <p className="text-gray-500">
                                Click to download PDF preview
                              </p>
                            </div>
                          )
                        }
                      </PDFDownloadLink>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!content && !loading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Sparkles className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">
                  Click "Generate Cover Letter" to create your personalized
                  letter
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


