import { NextRequest, NextResponse } from "next/server";
import {
  createServerComponentClient,
  createAdminClient,
} from "@/lib/supabase-server";
import { generateCoverLetter } from "@/lib/openai";
import { decryptApiKey } from "@/lib/utils";
import { CoverLetterPDF } from "@/components/CoverLetterPDF";
import { renderToBuffer } from "@react-pdf/renderer";
import { TemplateId } from "@/types";
import React from "react";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, templateId } = await request.json();

    if (!jobId || !templateId) {
      return NextResponse.json(
        { error: "Missing jobId or templateId" },
        { status: 400 }
      );
    }

    // Fetch job
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", session.user.id)
      .single();

    if (jobError || !job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const apiKey = profile.openai_api_key
      ? decryptApiKey(profile.openai_api_key)
      : null;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 400 }
      );
    }

    // Fetch paragraphs
    const { data: paragraphs, error: paragraphsError } = await supabase
      .from("paragraphs")
      .select("*")
      .eq("user_id", session.user.id);

    if (paragraphsError) {
      return NextResponse.json(
        { error: "Failed to fetch paragraphs" },
        { status: 500 }
      );
    }

    const introParagraphs = (paragraphs || [])
      .filter((p) => p.category === "intro")
      .map((p) => p.content);
    const experienceParagraphs = (paragraphs || [])
      .filter((p) => p.category === "experience")
      .map((p) => p.content);
    const conclusionParagraphs = (paragraphs || [])
      .filter((p) => p.category === "conclusion")
      .map((p) => p.content);

    if (introParagraphs.length === 0 || conclusionParagraphs.length === 0) {
      return NextResponse.json(
        {
          error:
            "Please add at least one intro and one conclusion paragraph",
        },
        { status: 400 }
      );
    }

    // Generate cover letter
    const content = await generateCoverLetter(apiKey, {
      jobDescription: job.description_text,
      resumeText: profile.resume_text || "",
      introParagraphs,
      experienceParagraphs,
      conclusionParagraphs,
    });

    // Generate PDF (use React.createElement instead of JSX in a .ts route)
    const pdfBuffer = await renderToBuffer(
      React.createElement(CoverLetterPDF, {
        content,
        templateId: templateId as TemplateId,
        jobTitle: job.title,
        company: job.company,
      })
    );

    // Upload PDF to Supabase Storage
    const adminClient = createAdminClient();
    const fileName = `cover-letter-${jobId}-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from("cover-letters")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload PDF" },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = adminClient.storage.from("cover-letters").getPublicUrl(fileName);

    // Save cover letter record
    const { data: letter, error: letterError } = await supabase
      .from("cover_letters")
      .insert({
        job_id: jobId,
        user_id: session.user.id,
        content_markdown: content,
        pdf_url: publicUrl,
        template_id: templateId,
      })
      .select()
      .single();

    if (letterError) {
      console.error("Letter save error:", letterError);
      return NextResponse.json(
        { error: "Failed to save cover letter" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      content,
      letterId: letter.id,
      pdfUrl: publicUrl,
    });
  } catch (error: any) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}

