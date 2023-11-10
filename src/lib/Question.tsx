import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import Select from "../components/Select";
import { DateType, QuestionType as QuestionTypeEnum } from "./enums";
import { v4 as uuidv4 } from "uuid";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

type ExtraFields = {
  dateType?: DateType;
  choices?: string[];
  other?: boolean;
  maxChoices?: number;
};

export type Question$ = {
  id: string;
  type: QuestionType;
  question: string;
  required: boolean;
  extra: ExtraFields;
};

interface QuestionProps {
  children?: ReactNode;
  question?: Question$;
  MAX_CHOICES?: number;
}

interface QuestionContext {
  get: {
    ID: string;
    type: QuestionType;
    question: string;
    required: boolean;
    extra: ExtraFields;
    edit: boolean | undefined;
    MAX_CHOICES: number;
  };
  set: {
    type: Dispatch<SetStateAction<QuestionType>>;
    question: Dispatch<SetStateAction<string>>;
    required: Dispatch<SetStateAction<boolean>>;
    extra: Dispatch<SetStateAction<ExtraFields>>;
    edit: Dispatch<SetStateAction<boolean | undefined>>;
  };
}

const ctx = createContext<QuestionContext | null>(null);

function useQuestionContext() {
  const context = useContext(ctx);
  if (!context) {
    throw Error("This component must be wrapped inside Question component");
  }
  return context;
}

export default function Question({
  children,
  question: q,
  MAX_CHOICES = 4,
}: QuestionProps) {
  const id = q?.id || uuidv4();

  // States
  const [type, setType] = useState(q?.type || "SHORT_ANSWER");
  const [required, setRequired] = useState(q?.required || false);
  const [extra, setExtra] = useState<ExtraFields>(q?.extra || {});
  const [question, setQuestion] = useState(q?.question || "");
  const [edit, setEdit] = useState(q ? false : undefined);

  const ctxInit: QuestionContext = {
    get: { ID: id, type, question, required, extra, edit, MAX_CHOICES },
    set: {
      type: setType,
      question: setQuestion,
      required: setRequired,
      extra: setExtra,
      edit: setEdit,
    },
  };

  return <ctx.Provider value={ctxInit}>{children}</ctx.Provider>;
}

// Edit question components
function EditType() {
  const { get, set } = useQuestionContext();

  if (get.edit !== undefined) return null;

  const types = Object.entries(QuestionTypeEnum).map((value) => ({
    label: value[1],
    value: value[0],
  }));

  function onChange(value: string) {
    const type = value as QuestionType;

    // Initial values
    const choices = get.extra.choices || [""];
    const other = get.extra.other || false;
    const maxChoices = get.extra.maxChoices || 1;
    const dateType = get.extra.dateType || ("date" as DateType);

    switch (type) {
      case "SHORT_ANSWER":
      case "PARAGRAPH":
      case "EMAIL":
      case "NUMBER":
        set.extra({});
        break;
      case "DATE":
        set.extra({ dateType });
        break;
      case "DROPDOWN":
        set.extra({ choices, other });
        break;
      case "MCQ":
        set.extra({ choices, other, maxChoices });
        break;
    }

    set.type(type);
  }

  return (
    <div className="form-group">
      <label htmlFor={`${get.ID}_type`}>Type</label>
      <Select
        id={`${get.ID}_type`}
        items={types}
        selectedIndex={0}
        onSelect={onChange}
      />
    </div>
  );
}

function EditQuestion() {
  const { get, set } = useQuestionContext();

  function onChange({ target: { value } }: TextAreaChangeEvent) {
    set.question(value);
  }

  return (
    <div className="form-group">
      <label htmlFor={`${get.ID}_question`}>Question</label>
      <textarea
        rows={2}
        id={`${get.ID}_question`}
        className="resize-none"
        value={get.question}
        onChange={onChange}
      />
    </div>
  );
}

function EditDateType() {
  const { get, set } = useQuestionContext();

  if (get.type !== "DATE") return null;

  const dateTypes = Object.entries(DateType).map((value) => ({
    label: value[1].split("-")[0],
    value: value[0],
  }));

  const value = get.extra.dateType;
  const selectedindex = dateTypes.findIndex((v) => v.value === value);

  function onChange(value: string) {
    const dateType = value as DateType;
    set.extra({ dateType });
  }

  return (
    <div className="form-group">
      <label htmlFor={`${get.ID}_dateType`}>Field type</label>
      <Select
        id={`${get.ID}_dateType`}
        items={dateTypes}
        onSelect={onChange}
        selectedIndex={selectedindex === -1 ? 0 : selectedindex}
      />
    </div>
  );
}

function EditRequired() {
  const { get, set } = useQuestionContext();

  function onChange({ target: { checked } }: InputChangeEvent) {
    set.required(checked);
  }

  return (
    <div className="flex gap-2">
      <input
        type="checkbox"
        id={`${get.ID}_required`}
        className="accent-primary"
        onChange={onChange}
        checked={get.required}
      />
      <label htmlFor={`${get.ID}_required`}>Required</label>
    </div>
  );
}

function EditOther() {
  const { get, set } = useQuestionContext();

  if (get.type !== "DROPDOWN" && get.type !== "MCQ") return null;

  function onChange({ target: { checked } }: InputChangeEvent) {
    set.extra((old) => ({ ...old, other: checked }));
  }

  return (
    <div className="flex gap-2">
      <input
        type="checkbox"
        id={`${get.ID}_other"`}
        className="accent-primary"
        checked={get.extra.other}
        onChange={onChange}
      />
      <label htmlFor={`${get.ID}_other"`}>Other</label>
    </div>
  );
}

function EditMaxChoices() {
  const { get, set } = useQuestionContext();

  if (get.type !== "MCQ") return null;

  function onChange({ target: { value } }: InputChangeEvent) {
    set.extra((old) => ({ ...old, maxChoices: +value }));
  }

  return (
    <div className="form-group">
      <label htmlFor={`${get.ID}_maxChoices`}>Max choices</label>
      <input
        id={`${get.ID}_maxChoices`}
        type="number"
        min={1}
        max={get.extra.choices?.length || 1}
        value={get.extra.maxChoices}
        onChange={onChange}
      />
    </div>
  );
}

function EditChoices() {
  const { get, set } = useQuestionContext();

  if (get.type !== "DROPDOWN" && get.type !== "MCQ") return null;

  function onChange(index: number) {
    return function ({ target: { value } }: InputChangeEvent) {
      set.extra((old) => {
        const choices = [...(old.choices as string[])];
        choices[index] = value;
        return { ...old, choices };
      });
    };
  }

  return (
    <div className="form-group">
      <label>Choices</label>
      <ul className="flex flex-col gap-3">
        {get.extra.choices!.map((choice, i) => {
          const add = get.extra.choices!.length < get.MAX_CHOICES;
          const del = i > 0;

          return (
            <li key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={choice}
                id={`${get.ID}_choice_${i}`}
                onChange={onChange(i)}
              />

              {add && <AddChoiceButton index={i} />}
              {del && <DelChoiceButton index={i} />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Form question component

// Helper components
function AddChoiceButton({ index }: { index: number }) {
  const { set } = useQuestionContext();

  function onClick() {
    set.extra((old) => {
      const choices = [...(old.choices as string[])];
      choices.splice(index + 1, 0, "");
      return { ...old, choices };
    });
  }

  return (
    <button className="btn-text" onClick={onClick}>
      <PlusOutlined />
    </button>
  );
}

function DelChoiceButton({ index }: { index: number }) {
  const { set } = useQuestionContext();

  function onClick() {
    set.extra((old) => {
      const choices = [...(old.choices as string[])];
      choices.splice(index, 1);
      return { ...old, choices };
    });
  }

  return (
    <button className="btn-text-danger " onClick={onClick}>
      <CloseOutlined />
    </button>
  );
}

export const Edit = {
  Type: EditType,
  Question: EditQuestion,
  DateType: EditDateType,
  Required: EditRequired,
  Other: EditOther,
  MaxChoices: EditMaxChoices,
  Choices: EditChoices,
};
