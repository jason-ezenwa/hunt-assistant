import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusColor(status: string) {
  const colors = {
    completed: { bg: "#6e56cf", text: "#ffffff", border: "#6e56cf" },
    "in-progress": { bg: "#f59e0b", text: "#ffffff", border: "#f59e0b" },
    applied: { bg: "#6e56cf", text: "#ffffff", border: "#6e56cf" },
    archived: { bg: "#6b7280", text: "#ffffff", border: "#6b7280" },
    default: { bg: "#6b7280", text: "#ffffff", border: "#6b7280" },
  };

  return colors[status as keyof typeof colors] || colors.default;
}
