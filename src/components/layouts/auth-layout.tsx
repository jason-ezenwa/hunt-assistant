import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-300 bg-clip-text text-transparent">
            Hunt Assistant
          </h1>
        </div>
        <div className="bg-card/50 backdrop-blur-lg rounded-xl border border-white/20 p-8 shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
