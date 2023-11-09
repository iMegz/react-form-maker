/*********\
| General |
\*********/
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
type TextAreaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;

/***********\
| Questions |
\***********/
type QuestionType =
  | "SHORT_ANSWER"
  | "PARAGRAPH"
  | "DROPDOWN"
  | "MCQ"
  | "EMAIL"
  | "NUMBER"
  | "DATE";

type DateType = "date" | "time" | "datetime-local";

interface CheckedValue {
  checked: { [key: string]: boolean };
  other: string;
}

// Default question props without type
interface DefaultQuestion {
  id: string;
  type: Exclude<QuestionType, "DATE" | "DROPDOWN" | "MCQ">;
  question: string;
  required?: boolean;
  dateType?: DateType;
  choices?: string[];
  other?: boolean;
  maxChoices?: number;
}

interface DateQuestion extends DefaultQuestion {
  type: "DATE";
  dateType: DateType;
  choices?: undefined;
  other?: undefined;
  maxChoices?: undefined;
}

interface DropdownQuestion extends DefaultQuestion {
  type: "DROPDOWN";
  choices: string[];
  dateType?: undefined;
}

interface MCQuestion extends DropdownQuestion {
  type: "MCQ";
  maxChoices: number;
}

type Question = DefaultQuestion | DateQuestion | DropdownQuestion | MCQuestion;
/*******\
| Forms |
\*******/

type Section = {
  id: string;
  title: string;
  questions: Question[];
};

interface NewForm {
  title: string;
  description?: string;
  // coverImg?: File | string;
  isPublic?: boolean;
  sections: Section[];
}

interface Form extends NewForm {
  id: string;
  // coverImg: string;
}

// Form application
type ResponseAnswerType = string | number | CheckedValue;

interface ResponseQuestion {
  id: string;
  title?: string;
  sectionId: string;
  type: QuestionType;
  value?: ResponseAnswerType;
}

interface ResponseSection {
  id: string;
  title?: string;
  questions: ResponseQuestion[];
}

interface FormResponse {
  id?: string;
  form: string;
  sections: ResponseSection[];
}

interface FormResponses {
  form: string;
  responses: FormResponse[];
}
