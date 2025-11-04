import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">No journeys yet</h3>
      <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
        Start your job hunting journey by creating your first application.
        Upload your resume and get personalized insights.
      </p>
      <Link href="/journey/new">
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Start your first journey
        </Button>
      </Link>
    </div>
  );
}
