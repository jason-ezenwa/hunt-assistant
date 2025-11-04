import Link from 'next/link';
import { JourneyClient } from '@/lib/db/models/journey.model';
import { Badge } from '@/components/ui/badge';

interface JourneyCardProps {
  journey: JourneyClient;
}

export default function JourneyCard({ journey }: JourneyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return { bg: "#CBF4C9", text: "#0E6245", border: "#CBF4C9" };
      case "in-progress":
        return { bg: "#F8E5BA", text: "#9C3F0F", border: "#F8E5BA" };
      case "applied":
        return { bg: "#FFE5E5", text: "#C53030", border: "#FFE5E5" };
      case "archived":
        return { bg: "#F3F4F6", text: "#6B7280", border: "#F3F4F6" };
      default:
        return { bg: "#FEF3C7", text: "#92400E", border: "#FEF3C7" };
    }
  };

  return (
    <Link href={`/journeys/${journey._id}`}>
      <div className="bg-card/50 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {journey.companyName}
            </h3>
            <p className="text-muted-foreground text-sm mb-2">
              {journey.jobTitle}
            </p>
          </div>
          <Badge
            className="text-xs border"
            style={{
              backgroundColor: getStatusColor(journey.status).bg,
              color: getStatusColor(journey.status).text,
              borderColor: getStatusColor(journey.status).border,
            }}>
            {journey.status.replace("-", " ")}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{journey.insights ? "✓ Insights" : "○ Insights"}</span>
          <span>
            {journey.coverLetter ? "✓ Cover Letter" : "○ Cover Letter"}
          </span>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          Created {new Date(journey.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}
