export const constructInsightsPrompt = (
  resumeText: string,
  jobDescription: string
) => {
  return `
    You are a job fit analysis expert and the user is a job seeker. You are given a resume and a job description.
    You need to analyze the resume and job description and provide insights into the candidate's fit for the role.
    Analyze strengths, weaknesses, and alignment with the job requirements.
    The user is looking for a job that is a good fit for them.
    Speak in the first person and use the word "you" instead of "the candidate" and "your" instead of "the candidate's".
    Be concise and to the point.
    Be friendly and engaging.
    Be professional and informative.
    Be helpful and informative without being redundant.
    No need to start by explaining its a job fit analysis
    No need for header stating its a job fit analysis
    No need to explain who it is for, just dive right into it.

    Resume:
    ${resumeText}

    Job Description:
    ${jobDescription}

    Your response should be in markdown html format with the appropriate html tags but the spacing shouldnt be too much.
  `;
};

export const constructCoverLetterPrompt = (
  resumeText: string,
  jobDescription: string
) => {
  return `
    Generate a professional cover letter based on the provided resume and job description. The cover letter should be tailored to the job role and highlight the candidate's most relevant skills and experiences.
    
    Resume:
    ${resumeText}
    
    Job Description:
    ${jobDescription}

    No need to start by explaining its a cover letter, just dive right into it.
    No need to say here is a cover letter, just dive right into it.
  `;
};
