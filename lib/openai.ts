import OpenAI from "openai";

export function createOpenAIClient(apiKey: string) {
  if (!apiKey) {
    throw new Error("OpenAI API key is required");
  }
  return new OpenAI({
    apiKey,
  });
}

export async function generateCoverLetter(
  apiKey: string,
  options: {
    jobDescription: string;
    resumeText: string;
    introParagraphs: string[];
    experienceParagraphs: string[];
    conclusionParagraphs: string[];
  }
): Promise<string> {
  const openai = createOpenAIClient(apiKey);

  const prompt = `You are an expert cover letter writer. Using only the provided paragraphs and resume facts, write a professional cover letter for this exact job description.

Rules:
- Pick ONE intro paragraph and adapt it to the job
- Pick the 2–3 MOST RELEVANT experience paragraphs and adapt them to highlight relevant skills
- Pick ONE conclusion paragraph and adapt it
- Keep total length 300–400 words
- Sound human and enthusiastic
- Never hallucinate experiences or skills not mentioned in the resume
- Use proper business letter format with paragraphs
- Be specific about how your experience matches the job requirements

Job Description:
${options.jobDescription}

Resume Summary:
${options.resumeText || "No resume provided"}

Available Intro Paragraphs:
${options.introParagraphs.map((p, i) => `${i + 1}. ${p}`).join("\n")}

Available Experience Paragraphs:
${options.experienceParagraphs.map((p, i) => `${i + 1}. ${p}`).join("\n")}

Available Conclusion Paragraphs:
${options.conclusionParagraphs.map((p, i) => `${i + 1}. ${p}`).join("\n")}

Write the cover letter in markdown format with proper paragraph breaks.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional cover letter writer. Write clear, compelling cover letters that match job requirements with the candidate's experience.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    return content;
  } catch (error: any) {
    if (error?.status === 401) {
      throw new Error("Invalid OpenAI API key");
    }
    if (error?.status === 429) {
      throw new Error("OpenAI API rate limit exceeded. Please try again later.");
    }
    throw new Error(`OpenAI API error: ${error?.message || "Unknown error"}`);
  }
}


