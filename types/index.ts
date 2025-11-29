export type ParagraphCategory = "intro" | "experience" | "conclusion";

export interface Paragraph {
  id: string;
  user_id: string;
  content: string;
  category: ParagraphCategory;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  user_id: string;
  title: string;
  company: string;
  description_text: string;
  link?: string;
  created_at: string;
  updated_at: string;
}

export interface CoverLetter {
  id: string;
  job_id: string;
  user_id: string;
  content_markdown: string;
  pdf_url?: string;
  template_id: string;
  created_at: string;
  updated_at: string;
  job?: Job;
}

export interface Profile {
  id: string;
  openai_api_key?: string;
  resume_text?: string;
  created_at: string;
  updated_at: string;
}

export type TemplateId = "classic" | "modern" | "minimal";


