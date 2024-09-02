import { z } from "zod";

export const userValidator = z.object({
  id: z.string(),
  email: z.string().nullable(),
  name: z.string().nullable(),
  password: z.string(),
});

export type UserType = z.infer<typeof userValidator>;
