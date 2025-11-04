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
        return "border bg-green-500/10 text-green-700 border-green-500/20";
      case 'in-progress':
        return "border bg-orange-600/15 text-orange-800 border-orange-600/25";
      case 'applied':
        return "border bg-primary/10 text-primary border-primary/20";
      case 'archived':
        return "border bg-muted text-muted-foreground border-muted-foreground/20";
      default:
        return "border bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
    }
  };

  return (
    <Link href={`/journey/${journey._id}`}>
      <div className="bg-card/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary group-hover:scale-105 transition-all duration-300 origin-left">
              {journey.companyName}
            </h3>
            <p className="text-muted-foreground text-sm mb-2 group-hover:text-primary group-hover:scale-105 transition-all duration-300 origin-left">
              {journey.jobTitle}
            </p>
          </div>
          <Badge className={`${getStatusColor(journey.status)} text-xs`}>
            {journey.status.replace("-", " ")}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground group-hover:text-primary group-hover:scale-105 transition-all duration-300 origin-left">
          <span>{journey.insights ? "✓ Insights" : "○ Insights"}</span>
          <span>
            {journey.coverLetter ? "✓ Cover Letter" : "○ Cover Letter"}
          </span>
        </div>

        <div className="mt-3 text-xs text-muted-foreground group-hover:text-primary group-hover:scale-105 transition-all duration-300 origin-left">
          Created {new Date(journey.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}
