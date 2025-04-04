import { z } from 'zod';

export const verifyEmailSchema = z.object({
    verifyCode: z.string().min(6, "Code must be at least 6 characters").max(6, "Code must not be greater than 6 characters"),
});