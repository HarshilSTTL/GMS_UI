import { z } from 'zod';

export const grievanceFormSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(80, 'Title must be 80 characters or less'),
  description: z.string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be 2000 characters or less'),
  district: z.string()
    .min(1, 'District is required'),
  taluka: z.string().optional().default(''),
  ward: z.string().optional().default(''),
  specificLocation: z.string().optional().default(''),
});

export type GrievanceFormData = z.infer<typeof grievanceFormSchema>;

export const INITIAL_FORM_DATA: GrievanceFormData = {
  title: '',
  description: '',
  district: '',
  taluka: '',
  ward: '',
  specificLocation: '',
};

export function validateForm(data: Partial<GrievanceFormData>) {
  return grievanceFormSchema.safeParse(data);
}
