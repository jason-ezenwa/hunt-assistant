/**
 * Markdown template description injected into the AI system prompt.
 * Guides the AI on the exact Markdown structure to use when generating
 * the tailored resume.
 */
export const RESUME_TEMPLATE_DESCRIPTION = `
ABSOLUTE RULES — violations are not acceptable:

1. ZERO FABRICATION. Every single word of content must come directly from the base resume text.
   - Do NOT invent metrics, percentages, or numbers that are not in the base resume.
   - Do NOT add skills, tools, frameworks, or technologies that are not listed in the base resume.
   - Do NOT add bullet points, responsibilities, or achievements that are not in the base resume.
   - Do NOT copy skills or technologies from the job description into the resume unless they already appear in the base resume.
   - If a number or claim is in the base resume (e.g. "99.9% uptime", "₦35m+"), you may use it. If it is not there, do not invent it.

2. CONTACT INFO. The base resume text is extracted from a PDF and may contain hyperlink labels (e.g. "Portfolio", "Github", "LinkedIn", "Blog") with no actual URLs. Include only the phone number and email address in the contact line. Omit all bare link labels (Portfolio, Github, LinkedIn, Blog, etc.) since they have no usable URLs.

3. WORD SPACING. The PDF extraction may have concatenated words without spaces (e.g. "FullStackEngineer" instead of "Full Stack Engineer"). Fix any obviously concatenated words by restoring natural word spacing. Do not change the meaning — only restore missing spaces.

4. DATES. Only include dates that are explicitly stated in the base resume. If a date is missing or unknown, omit it entirely — do NOT write placeholders like "Month Year", "Present", or "N/A".

5. TAILORING. Active tailoring is required — a resume that looks identical to the base resume is a failure. You MUST:
   a. REWRITE the Summary from scratch (using only facts from the base resume) to directly address the role's core requirements. Mirror the job's language where you have matching evidence. Make it clear this candidate is a strong fit for *this specific role*.
   b. REORDER and PRUNE bullet points within each job. Most relevant bullets go first. Any bullet that has no signal for this specific role MUST be removed — do not keep bullets just to fill space. A shorter, focused entry is better than a long one padded with irrelevant work. Aim to keep only the 3–5 strongest bullets per role.
   c. REPHRASE existing bullets to use the job description's exact keywords where the underlying work is the same (e.g. if the JD says "stakeholder collaboration" and the resume says "worked with cross-functional teams", use the JD's phrasing).
   d. REORDER and PRUNE skills. Front-load the most relevant categories and skills. Remove individual skills and entire categories that have no relevance to this role — do not keep skills just because they are in the base resume. A focused skills section beats an exhaustive one.
   e. ADJUST the section order if a section is particularly strong for this role (e.g. move Education before Skills if academic background is key).
   You may NOT add, invent, or import anything not already in the base resume.

6. OPTIONAL SECTIONS. For Projects and Certifications:
   - ONLY include a PROJECTS section if the base resume contains an explicit, dedicated Projects section. Do NOT create one from bullet points found inside Work Experience entries.
   - ONLY include a CERTIFICATIONS section if the base resume contains actual certifications. If there are none, omit the section entirely — do NOT write any placeholder text like "(No certifications listed)".

SECTION ORDER (fixed — follow exactly):
1. Header — name, phone, email only (no bare link labels)
2. Summary
3. Work Experience — ONLY if present in the base resume
4. Skills (or Technical Skills)
5. Education
6. Projects — ONLY if an explicit Projects section exists in the base resume
7. Certifications — ONLY if actual certifications exist in the base resume

MARKDOWN TEMPLATE (use this structure exactly):

# FULL NAME
phone | email

## SUMMARY
Summary text here.

## WORK EXPERIENCE

### Job Title
**Company Name, Location** | *Employment Type* | *Month Year – Month Year*

- Bullet point using only content from the base resume.
- Bullet point using only content from the base resume.

### Job Title
**Company Name, Location** | *Employment Type* | *Month Year – Month Year*

- Bullet point using only content from the base resume.

## TECHNICAL SKILLS

**Category:** skill1, skill2, skill3
**Category:** skill1, skill2, skill3

## EDUCATION

### Degree / Certification
**Institution Name** | *Month Year*

## PROJECTS

### Project Name
- Project detail using only content from the base resume.

## CERTIFICATIONS
- Certification Name — Issuing Body, Year

FORMATTING RULES:
- Name: # heading (H1)
- Contact line: plain text, items separated by |
- Section headers: ## heading (H2), written in ALL CAPS
- Job titles / degree names: ### heading (H3)
- Company/institution line: bold name, pipe separator, italic employment type, italic date range
- Bullet points: standard - list items
- Skills: **Bold category label:** followed by comma-separated items, one category per line
- No emojis, no icons, no HTML, no horizontal rules.
- Output raw Markdown only — no code fences, no \`\`\`markdown wrapper.
`;
