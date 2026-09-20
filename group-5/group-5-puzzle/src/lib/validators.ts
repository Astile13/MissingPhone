import { z } from "zod";

export const NameInput = z.object({
  name: z.string().trim().min(1).max(30),
});

export const FinishInput = z.object({
  id: z.string().min(1),
  startedAt: z.number().int().positive(), // Date.now() from the frontend
});