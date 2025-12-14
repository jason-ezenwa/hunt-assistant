# Hunt Assistant

Hunt Assistant is an AI-powered job application co-pilot that solves a real pain point - writing cover letters sucks. This app analyzes your resume against job descriptions, gives you insights on how well you fit for the role, and generates tailored cover letters you can download as Word documents. Hunt Assistant also helps you track your job applications in one place.

If you're like me and you hate writing cover letters, this is for you.

## Features

- **AI-Powered Insights**: Get detailed analysis of how your qualifications match job requirements
- **Automated Cover Letters**: Generate personalized cover letters tailored to specific job descriptions
- **Document Processing**: Upload and process PDF and DOCX resume files
- **Download Ready**: Export cover letters as properly formatted Word documents
- **Job Journey Tracking**: Manage your application process from draft to completion
- **Playground Mode**: Test the AI features without creating an account

## Technical Highlights

### Dual AI Integration
Built with both OpenAI and Groq APIs with automatic fallback switching. The app intelligently chooses between providers based on availability and cost optimization.

### Advanced Document Processing
- Handles PDF and DOCX resume uploads with custom text extraction using `mammoth` and `pdf-parse` libraries
- Custom markdown-to-DOCX converter that preserves formatting using the `docx` library
- Sophisticated paragraph and heading parsing for professional document generation

### Full Authentication System
Implemented with `better-auth` and MongoDB adapter, supporting both email/password authentication and Google OAuth.

### Modern Tech Stack
- **Frontend**: Next.js 15 with TypeScript, TanStack Query for state management, Radix UI components, Tailwind CSS
- **Backend**: Next.js API routes with MongoDB and Mongoose ODM
- **Authentication**: Better-auth with MongoDB adapter, email/password and Google OAuth
- **AI**: Dual provider integration (OpenAI + Groq) with intelligent switching
- **Validation**: Zod schemas for type-safe data validation
- **File Uploads**: Multer integration with proper MIME type handling

### Production-Ready Features
- Comprehensive error handling and logging
- RESTful API design with proper authorization
- Responsive mobile-first UI
- Real-time toast notifications and loading states

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB
- OpenAI API key (optional, can use Groq instead)
- Groq API key (optional, can use OpenAI instead)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jason-ezenwa/hunt-assistant.git
   cd hunt-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/hunt-assistant

   # AI Providers (at least one required)
   OPENAI_API_KEY=your_openai_api_key_here
   GROQ_API_KEY=your_groq_api_key_here

   # Authentication
   GOOGLE_SSO_CLIENT_ID=your_google_client_id
   GOOGLE_SSO_CLIENT_SECRET=your_google_client_secret
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.


## Deployment

### Vercel Deployment

The easiest way to deploy is using Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel's dashboard
4. Deploy!

### Manual Deployment

For other platforms, ensure you have:
- Node.js runtime
- MongoDB connection
- Environment variables configured
- Build command: `npm run build`
- Start command: `npm start`

## Contributing

This was a solo project, but feel free to open issues or submit pull requests for improvements!

## License

This project is licensed under the Mozilla Public License Version 2.0 - see the [LICENSE.md](LICENSE.md) file for details.
