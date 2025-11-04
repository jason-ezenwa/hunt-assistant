import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusColor(status: string) {
  const colors = {
    completed: { bg: "#CBF4C9", text: "#0E6245", border: "#CBF4C9" },
    "in-progress": { bg: "#F8E5BA", text: "#9C3F0F", border: "#F8E5BA" },
    applied: { bg: "#DCFCE7", text: "#166534", border: "#DCFCE7" },
    archived: { bg: "#F3F4F6", text: "#6B7280", border: "#F3F4F6" },
    default: { bg: "#FEF3C7", text: "#92400E", border: "#FEF3C7" },
  };

  return colors[status as keyof typeof colors] || colors.default;
}
