import { useQuery } from '@tanstack/react-query';
import type { JourneyClient } from '@/lib/db/models/journey.model';

export function useJourneys() {
  return useQuery<JourneyClient[]>({
    queryKey: ['journeys'],
    queryFn: async () => {
      const response = await fetch('/api/journeys');
      if (!response.ok) throw new Error('Failed to fetch journeys');
      return response.json();
    },
  });
}

export function useJourney(id: string) {
  return useQuery<JourneyClient>({
    queryKey: ['journey', id],
    queryFn: async () => {
      const response = await fetch(`/api/journeys/${id}`);
      if (!response.ok) throw new Error('Failed to fetch journey');
      return response.json();
    },
    enabled: !!id,
  });
}
