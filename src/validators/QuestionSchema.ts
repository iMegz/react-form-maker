import { z } from "zod";
import { DateType, DefaultQuestionType } from "../lib/enums";
import messages from "./messages";

const QuestionTypeEnumKeys = Object.keys(DefaultQuestionType) as [string];
const QuestionTypeSchema = z.enum(QuestionTypeEnumKeys);
const DateTypeSchema = z.nativeEnum(DateType);
const ChoicesSchema = z
  .array(z.string().min(1, messages.minmax("Choice", 1)))
  .min(1, messages.size("Dropdown question", "choice", 1));
const DropdownExtraSchema = z.object({
  other: z.boolean(),
  choices: ChoicesSchema,
});
const MCQExtraSchema = DropdownExtraSchema.extend({
  maxChoices: z.coerce.number().gt(0, messages.isPositive("Max choices")),
});

const DefaultQuestionSchema = z.object({
  id: z.string(),
  type: QuestionTypeSchema,
  question: z.string().min(3, messages.minmax("Question", 3)),
  required: z.boolean().optional(),
  extra: z.object({}).optional(),
});

const DateQuestionSchema = DefaultQuestionSchema.extend({
  type: z.literal("DATE"),
  extra: z.object({ dateType: DateTypeSchema }),
});

const DropdownQuestionSchema = DefaultQuestionSchema.extend({
  type: z.literal("DROPDOWN"),
  extra: DropdownExtraSchema,
});

const MCQuestionSchema = DropdownQuestionSchema.extend({
  type: z.literal("MCQ"),
  extra: MCQExtraSchema,
});

export default z.discriminatedUnion("type", [
  DefaultQuestionSchema,
  DateQuestionSchema,
  DropdownQuestionSchema,
  MCQuestionSchema,
]);
