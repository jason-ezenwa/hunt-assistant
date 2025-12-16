import { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-card-foreground">
            Hunt Assistant
          </h1>
        </div>
        <Card>
          <CardContent className="p-8">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
