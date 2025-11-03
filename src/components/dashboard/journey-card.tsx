import Link from 'next/link';
import { JourneyClient } from '@/lib/db/models/journey.model';
import { Badge } from '@/components/ui/badge';

interface JourneyCardProps {
  journey: JourneyClient;
}

export default function JourneyCard({ journey }: JourneyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'applied':
        return 'bg-purple-100 text-purple-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Link href={`/journey/${journey._id}`}>
      <div className="bg-card/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {journey.companyName}
            </h3>
            <p className="text-muted-foreground text-sm mb-2">
              {journey.jobTitle}
            </p>
          </div>
          <Badge className={`${getStatusColor(journey.status)} text-xs`}>
            {journey.status.replace('-', ' ')}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {journey.insights ? '✓ Insights' : '○ Insights'}
          </span>
          <span>
            {journey.coverLetter ? '✓ Cover Letter' : '○ Cover Letter'}
          </span>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          Created {new Date(journey.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}
