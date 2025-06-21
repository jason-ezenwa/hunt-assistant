type LogLevel = "info" | "error" | "warn";

export function logEvent(
  level: LogLevel,
  message: string,
  data: Record<string, unknown> = {}
) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({ timestamp, level, message, ...data }));
} 