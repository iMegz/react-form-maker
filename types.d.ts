/*********\
| General |
\*********/
type InputProps = React.HtmlHTMLAttributes<HTMLInputElement>;
type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
type TextAreaProps = React.HtmlHTMLAttributes<HTMLTextAreaElement>;
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
  coverImg?: File;
  isPublic?: boolean;
  sections: Section[];
}

interface Form extends NewForm {
  id: string;
  coverImg: string;
}

// Form application
interface ApplicationQuestion {
  type: QuestionType;
  answer: string | string[] | number | Date;
}

interface ApplicationSection {
  question: ApplicationQuestion[];
}

interface ApplicationForm {
  sections: ApplicationSection[];
}
