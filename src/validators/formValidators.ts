import { z } from "zod";
import { DateType, DefaultQuestionType } from "../lib/enums";

const COVER_IMG_MAX_SIZE = 250 * 1024; // 250 KB

const messages = {
  minmax(field: string, value: number, min = true) {
    const minOrMax = min ? "least" : "most";
    const s = value > 1 ? "s" : "";
    return `${field} must be at ${minOrMax} ${value} character${s}`;
  },
  size(field: string, subField: string, value: number, min = true) {
    const minOrMax = min ? "least" : "most";
    const s = value > 1 ? "s" : "";
    return `${field} must have at ${minOrMax} ${value} ${subField}${s}`;
  },
  isPositive(field: string) {
    return `${field} must have a positive value`;
  },
};

const QuestionTypeEnumKeys = Object.keys(DefaultQuestionType) as [string];
const QuestionTypeSchema = z.enum(QuestionTypeEnumKeys);
const DateTypeSchema = z.nativeEnum(DateType);
const ChoicesSchema = z
  .array(z.string().min(1, messages.minmax("Choice", 1)))
  .min(1, messages.size("Dropdown question", "choice", 1));

const DefaultQuestionSchema = z.object({
  id: z.string(),
  type: QuestionTypeSchema,
  question: z.string().min(3, messages.minmax("Question", 3)),
  required: z.boolean().optional(),
  dateType: DateTypeSchema.optional(),
  choices: z.array(z.string()).optional(),
  other: z.boolean().optional(),
  maxChoices: z.coerce.number().optional(),
});

const DateQuestionSchema = DefaultQuestionSchema.extend({
  type: z.literal("DATE"),
  dateType: DateTypeSchema,
  choices: z.undefined(),
  other: z.undefined(),
  maxChoices: z.undefined(),
});

const DropdownQuestionSchema = DefaultQuestionSchema.extend({
  type: z.literal("DROPDOWN"),
  dateType: z.undefined(),
  choices: ChoicesSchema,
});

const MCQuestionSchema = DropdownQuestionSchema.extend({
  type: z.literal("MCQ"),
  maxChoices: z.coerce.number().gt(0, messages.isPositive("Max choices")),
});

const QuestionSchema = z.discriminatedUnion("type", [
  DefaultQuestionSchema,
  DateQuestionSchema,
  DropdownQuestionSchema,
  MCQuestionSchema,
]);

const SectionSchema = z.object({
  id: z.string(),
  title: z.string().min(3, messages.minmax("Section title", 3)),
  questions: z
    .array(QuestionSchema)
    .min(1, messages.size("Section", "question", 1)),
});

const NewFormSchema = z.object({
  title: z.string().min(3, messages.minmax("Form title", 3)),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  sections: z.array(SectionSchema).min(1, messages.size("Form", "section", 1)),
  coverImg: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .superRefine((file, ctx) => {
      if (file && file instanceof File) {
        //File larger than 250KB
        if (file.size > COVER_IMG_MAX_SIZE) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Image size should be less than ${
              COVER_IMG_MAX_SIZE / 1024
            }KB`,
          });
        } else if (!/^image\/(jpg|png|jpeg|svg)$/.test(file.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Image type must be jpeg, jpg, png, or svg",
          });
        }
      }
    }),
});

export { QuestionSchema, NewFormSchema };
