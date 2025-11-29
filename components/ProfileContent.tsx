"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClientComponentClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { encryptApiKey, decryptApiKey } from "@/lib/utils";
import { ResumeUploader } from "@/components/ResumeUploader";
import { ParagraphManager } from "@/components/ParagraphManager";
import { Profile, Paragraph } from "@/types";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileContentProps {
  profile: Profile | null;
  paragraphs: Paragraph[];
  userId: string;
}

export function ProfileContent({
  profile,
  paragraphs,
  userId,
}: ProfileContentProps) {
  const [apiKey, setApiKey] = useState(
    profile?.openai_api_key ? decryptApiKey(profile.openai_api_key) : ""
  );
  const [saving, setSaving] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const router = useRouter();

  const handleSaveApiKey = async () => {
    setSaving(true);

    try {
      const encrypted = encryptApiKey(apiKey);

      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        openai_api_key: encrypted,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "API key saved",
      });
    } catch (error: any) {
      console.error("Error saving API key:", error);
      const description =
        error?.message ||
        error?.details ||
        error?.hint ||
        "Failed to save API key";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const hasApiKey = !!apiKey.trim();
  const hasIntro = paragraphs.some((p) => p.category === "intro");
  const hasConclusion = paragraphs.some((p) => p.category === "conclusion");

  return (
    <div className="space-y-6">
      {/* API Key Section */}
      <Card>
        <CardHeader>
          <CardTitle>OpenAI API Key</CardTitle>
          <CardDescription>
            Your API key is encrypted and stored securely. Get your key from{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              OpenAI Platform
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasApiKey && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                API key is required to generate cover letters
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
            />
          </div>
          <Button onClick={handleSaveApiKey} disabled={saving}>
            {saving ? "Saving..." : "Save API Key"}
          </Button>
        </CardContent>
      </Card>

      {/* Resume Section */}
      <ResumeUploader
        onUploadComplete={() => {
          router.refresh();
        }}
      />

      {/* Requirements Check */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements Check</CardTitle>
          <CardDescription>
            Make sure you have everything needed to generate cover letters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            {hasApiKey ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={hasApiKey ? "text-green-700" : "text-red-700"}>
              OpenAI API Key {hasApiKey ? "configured" : "missing"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasIntro ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={hasIntro ? "text-green-700" : "text-red-700"}>
              At least 1 intro paragraph {hasIntro ? "added" : "required"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasConclusion ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={hasConclusion ? "text-green-700" : "text-red-700"}>
              At least 1 conclusion paragraph{" "}
              {hasConclusion ? "added" : "required"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Paragraph Manager */}
      <ParagraphManager
        paragraphs={paragraphs}
        userId={userId}
        onUpdate={() => {
          router.refresh();
        }}
      />
    </div>
  );
}


