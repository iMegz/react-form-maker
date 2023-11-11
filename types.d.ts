type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
type TextAreaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

type QuestionType =
  | "SHORT_ANSWER"
  | "PARAGRAPH"
  | "DROPDOWN"
  | "MCQ"
  | "EMAIL"
  | "NUMBER"
  | "DATE";

type DateType = "date" | "time" | "datetime-local";

interface ExtraFields {
  dateType?: DateType;
  choices?: string[];
  other?: boolean;
  maxChoices?: number;
}

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  required: boolean;
  extra: ExtraFields;
}

/*******\
| Forms |
\*******/

type Section = {
  id: string;
  title: string;
  questions: Question[];
};

interface FormInfo {
  id?: string;
  title: string;
  description: string;
  isPublic: boolean;
}

interface NewForm extends FormInfo {
  sections: Section[];
}

interface Form extends NewForm {
  id: string;
}

// --------------------------------
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

// interface CheckedValue {
//   checked: { [key: string]: boolean };
//   other: string;
// }
