import { z } from 'zod';

// Art form validation schema
export const artFormSchema = z.object({
  artImage: z.instanceof(File)
  .refine((file) => file instanceof File, "Invalid file type")
  .refine((file) => file.size <= 5000000, `Max file size is 5MB.`)
  .refine(
    (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported."
  ),
  artName: z.string().min(1, 'Art name is required').max(20, 'Art name must be 20 characters or less'),
  artistName: z.string().min(1, 'Artist name is required').max(30, 'Artist name must be 30 characters or less'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description must be 500 characters or less'),
});
