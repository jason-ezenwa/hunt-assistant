type Message = {
  role: "system" | "user";
  content: string;
};

export const constructInsightsMessages = (
  resumeText: string,
  jobDescription: string
): Message[] => {
  return [
    {
      role: "system",
      content: `
          You are a job fit analysis expert and the user is a job seeker. You are given a resume and a job description.
          You need to analyze the resume and job description and provide insights into the candidate's fit for the role.
          Analyze strengths, weaknesses, and alignment with the job requirements.
          The insights generated should be in markdown.
          The user is looking for a job that is a good fit for them.
          Speak in the first person and use the word "you" instead of "the candidate" and "your" instead of "the candidate's".
          Be concise and to the point.
          Be professional and informative.
          Be helpful and informative without being redundant.
          No need to start by explaining its a job fit analysis
          No need for header stating its a job fit analysis
          No need to explain who it is for, just dive right into it.
          Go straight to the analysis without any preamble.
        `,
    },
    {
      role: "user",
      content: `
          Resume:
          ${resumeText}

          Job Description:
          ${jobDescription}
        `,
    },
  ];
};

export const constructCoverLetterMessages = (
  resumeText: string,
  jobDescription: string
): Message[] => {
  return [
    {
      role: "system",
      content: `
        You are a professional cover letters writer. You are given a resume and a job description.
        You need to generate a professional cover letter based on the provided resume and job description. The cover letter should be tailored to the job role and highlight the candidate's most relevant skills and experiences.
        The cover letter generated should be in markdown.
        You are speaking to the hiring manager, start with "Dear Hiring Manager".
        This should follow the standard format for a formal letter.
        No need to start by explaining its a cover letter.
        No need to say "here is a cover letter".
        Do not include placeholders for the name, address, phone number, email, etc. Stuff like [Company Name] should be the actual company name.
        `,
    },
    {
      role: "user",
      content: `
          Resume:
          ${resumeText}
          
          Job Description:
          ${jobDescription}
        `,
    },
  ];
};
