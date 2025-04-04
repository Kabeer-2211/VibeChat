import { z } from 'zod';

export const changePasswordSchema = z.object({
    password: z.string().min(8),
    new_password: z.string().min(8),
});