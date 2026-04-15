import Groq from 'groq-sdk';
import { RESUME_TEMPLATE_DESCRIPTION } from '@/lib/resume/resume-template';
import { logEvent } from '@/lib/core/logger';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Generates a tailored resume as a Markdown string.
 * Same pattern as cover letter and insights generation.
 */
export async function generateTailoredResumeMarkdown(
  resumeText: string,
  jobDescription: string
): Promise<string> {
  logEvent('info', 'Generating tailored resume');

  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `You are an expert resume writer. Your job is to tailor the user's resume to a specific job description.
Output the resume as Markdown only. Do not use emojis anywhere in the output.

${RESUME_TEMPLATE_DESCRIPTION}`,
      },
      {
        role: 'user',
        content: `BASE RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Generate a tailored version of this resume that highlights the most relevant experience and skills for this job.`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content?.trim() || '';

  if (!content) {
    throw new Error('No resume content returned from model');
  }

  logEvent('info', 'Successfully generated tailored resume');
  return content;
}
