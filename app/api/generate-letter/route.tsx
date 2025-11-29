import { NextRequest, NextResponse } from "next/server";
import {
  createServerComponentClient,
  createAdminClient,
} from "@/lib/supabase-server";
import { generateCoverLetter } from "@/lib/openai";
import { decryptApiKey } from "@/lib/utils";
import { TemplateId } from "@/types";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const runtime = "nodejs";
export const maxDuration = 60;

const TEMPLATE_ID_MAP: Record<TemplateId, number> = {
  classic: 1,
  modern: 2,
  minimal: 3,
};

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

    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", session.user.id)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
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

    const { data: rawParagraphs, error: paragraphsError } = await supabase
      .from("paragraphs")
      .select("*")
      .eq("user_id", session.user.id);

    if (paragraphsError) {
      return NextResponse.json(
        { error: "Failed to fetch paragraphs" },
        { status: 500 }
      );
    }

    const introParagraphs = (rawParagraphs || [])
      .filter((p) => p.category === "intro")
      .map((p) => p.content);
    const experienceParagraphs = (rawParagraphs || [])
      .filter((p) => p.category === "experience")
      .map((p) => p.content);
    const conclusionParagraphs = (rawParagraphs || [])
      .filter((p) => p.category === "conclusion")
      .map((p) => p.content);

    if (introParagraphs.length === 0 || conclusionParagraphs.length === 0) {
      return NextResponse.json(
        {
          error: "Please add at least one intro and one conclusion paragraph",
        },
        { status: 400 }
      );
    }

    const content = await generateCoverLetter(apiKey, {
      jobDescription: job.description_text,
      resumeText: profile.resume_text || "",
      introParagraphs,
      experienceParagraphs,
      conclusionParagraphs,
    });

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    let { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const margin = 50;
    let y = height - margin;

    const maxLineWidth = width - margin * 2;

    const wrapText = (text: string, size: number, usedFont: typeof font) => {
      const words = text.split(/\s+/);
      const lines: string[] = [];
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = usedFont.widthOfTextAtSize(testLine, size);
        if (testWidth <= maxLineWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    const ensureSpace = (lineHeight: number) => {
      if (y - lineHeight < margin) {
        page = pdfDoc.addPage();
        ({ width, height } = page.getSize());
        y = height - margin;
      }
    };

    const drawText = (
      text: string,
      options: { bold?: boolean; size?: number } = {}
    ) => {
      const size = options.size ?? 12;
      const usedFont = options.bold ? boldFont : font;
      const rawLines = text.split("\n");
      const lines = rawLines.flatMap((line) =>
        line.trim() ? wrapText(line, size, usedFont) : [""]
      );
      for (const line of lines) {
        const lineHeight = size + 4;
        ensureSpace(lineHeight);
        if (line) {
          page.drawText(line, {
            x: margin,
            y,
            size,
            font: usedFont,
            color: rgb(0.1, 0.1, 0.1),
          });
        }
        y -= lineHeight;
      }
      y -= 4;
    };

    drawText("Your Name", { bold: true, size: 18 });
    drawText("your.email@example.com · (555) 123-4567 · Your City, State ZIP", {
      size: 10,
    });
    y -= 10;

    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    drawText(dateStr, { size: 10 });
    drawText("Hiring Manager", { size: 11 });
    drawText(job.company, { size: 11 });
    y -= 10;

    drawText("Dear Hiring Manager,", { size: 12 });

    const bodyParagraphs = content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    for (const p of bodyParagraphs) {
      drawText(p, { size: 12 });
      y -= 4;
    }

    y -= 10;
    drawText("Sincerely,", { size: 12 });
    drawText("Your Name", { size: 12 });

    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    const adminClient = createAdminClient();
    const fileName = `cover-letter-${jobId}-${Date.now()}.pdf`;
    const { error: uploadError } = await adminClient.storage
      .from("cover-letters")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "Failed to upload PDF" },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = adminClient.storage.from("cover-letters").getPublicUrl(fileName);

    const { data: letter, error: letterError } = await supabase
      .from("cover_letters")
      .insert({
        job_id: jobId,
        user_id: session.user.id,
        content_markdown: content,
        pdf_url: publicUrl,
        template_id: TEMPLATE_ID_MAP[templateId as TemplateId],
      })
      .select()
      .single();

    if (letterError) {
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
    return NextResponse.json(
      { error: error.message || "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
