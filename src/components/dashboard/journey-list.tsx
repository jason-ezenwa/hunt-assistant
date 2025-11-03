import { JourneyClient } from '@/lib/db/models/journey.model';
import JourneyCard from './journey-card';

interface JourneyListProps {
  journeys: JourneyClient[];
  isLoading?: boolean;
}

export default function JourneyList({ journeys, isLoading }: JourneyListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-card/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg animate-pulse">
            <div className="h-4 bg-muted/50 rounded mb-2"></div>
            <div className="h-3 bg-muted/50 rounded mb-4"></div>
            <div className="h-3 bg-muted/50 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (journeys.length === 0) {
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
        <h3 className="text-lg font-medium mb-2">No applications yet</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Start your job hunting journey by creating your first application. Upload your resume and get personalized insights.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {journeys.map((journey) => (
        <JourneyCard key={journey._id} journey={journey} />
      ))}
    </div>
  );
}
