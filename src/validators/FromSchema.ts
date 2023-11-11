import { z } from "zod";

import messages from "./messages";
import QuestionSchema from "./QuestionSchema";

// const COVER_IMG_MAX_SIZE = 250 * 1024; // 250 KB

const SectionSchema = z.object({
  id: z.string(),
  title: z.string().min(3, messages.minmax("Section title", 3)),
  questions: z
    .array(QuestionSchema)
    .min(1, messages.size("Section", "question", 1)),
});

const FormSchema = z.object({
  title: z.string().min(3, messages.minmax("Form title", 3)),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  sections: z.array(SectionSchema).min(1, messages.size("Form", "section", 1)),
  // coverImg: z
  //   .union([z.instanceof(File), z.string()])
  //   .optional()
  //   .superRefine((file, ctx) => {
  //     if (file && file instanceof File) {
  //       //File larger than 250KB
  //       if (file.size > COVER_IMG_MAX_SIZE) {
  //         ctx.addIssue({
  //           code: z.ZodIssueCode.custom,
  //           message: `Image size should be less than ${
  //             COVER_IMG_MAX_SIZE / 1024
  //           }KB`,
  //         });
  //       } else if (!/^image\/(jpg|png|jpeg|svg)$/.test(file.type)) {
  //         ctx.addIssue({
  //           code: z.ZodIssueCode.custom,
  //           message: "Image type must be jpeg, jpg, png, or svg",
  //         });
  //       }
  //     }
  //   }),
});

export default FormSchema;
