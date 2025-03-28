import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
function checkFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    return ["png", "jpg", "jpeg"].includes(fileType?.toLowerCase() || "");
  }
  return false;
}

export const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(200, "Bio must not exceed 200 characters")
    .nullable(),
  avatar: z
    .instanceof(File)
    .refine((file) => checkFileType(file), {
      message: "only .jpg, .png, .jpeg formats are allowed",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size should not exceed 5MB",
    })
    .optional(),
  email: z.string().email(),
  password: z.string().min(8),
});
