import { z, ZodType } from "zod";

export const newFormSchema: ZodType<NewForm> = z.object({
  title: z.string().min(3, "Form title must be at least 3 characters"),
  description: z.string().optional(),
  coverImg: z.instanceof(FileList).superRefine((files, ctx) => {
    if (files.length === 1) {
      const file = files[0];

      //File larger than 250KB
      if (file.size > 250 * 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Image size should be less than 250KB",
        });
      } else if (!/^image\/(jpg|png|jpeg|svg)$/.test(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Image type must be jpeg, jpg, png, or svg",
        });
      }
    } else if (files.length > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select only one image",
      });
    }
  }),
});

export type NewFormSchema = z.infer<typeof newFormSchema>;
