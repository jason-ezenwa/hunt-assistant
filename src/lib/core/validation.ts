import { ZodSchema } from "zod";
import { BadRequestError } from "./errors";

export function validateWithSchema<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errorMessage = result.error.errors.map((e) => e.message).join(", ");
    throw new BadRequestError(errorMessage);
  }

  return result.data;
}
