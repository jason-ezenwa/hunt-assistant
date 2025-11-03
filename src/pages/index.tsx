import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Geist } from 'next/font/google';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Footer from '@/components/ui/footer';
import { useSession } from '@/lib/hooks/use-session';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session) {
      router.push('/dashboard');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className={`min-h-screen bg-background text-foreground ${geistSans.variable} font-[family-name:var(--font-geist-sans)] flex items-center justify-center`}>
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background text-foreground ${geistSans.variable} font-[family-name:var(--font-geist-sans)]`}>
      <div className="flex flex-col gap-6 lg:gap-8 relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="text-center py-20 px-4">
            <h1 className="leading-tight text-5xl font-bold mb-4 tracking-tighter bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Hunt Assistant
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Your personal AI-powered job hunting co-pilot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/sign-up">
                <Button variant="secondary" className="px-8 py-3 text-lg font-medium">
                  Get started
                </Button>
              </Link>
              <Link href="/playground">
                <Button className="px-8 py-3 text-lg font-medium">
                  Try demo
                </Button>
              </Link>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 px-4 bg-card/30">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Everything you need for job applications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-background/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Resume analysis</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Upload your resume and get detailed insights on how well it matches each job opportunity.
                  </p>
                </div>

                <div className="bg-background/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Tailored cover letters</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Generate personalized cover letters that highlight your most relevant skills and experiences.
                  </p>
                </div>

                <div className="bg-background/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI-powered insights</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get intelligent analysis of job requirements and how your background aligns with them.
                  </p>
                </div>

                <div className="bg-background/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Save & reuse</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Store all your applications and generated content for easy access and future reference.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to supercharge your job search?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who are landing better opportunities with personalized insights and professional cover letters.
            </p>
            <Link href="/auth/sign-up">
              <Button className="px-8 py-3 text-lg font-medium">
                Start your journey
              </Button>
            </Link>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
