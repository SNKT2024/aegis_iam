import z from "zod";

export const userRegistrationSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(15),
});
