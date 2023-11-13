import {
  PropsWithChildren,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { DateType, QuestionType as QuestionTypeEnum } from "../../lib/enums";
import { v4 as uuidv4 } from "uuid";
import { CloseOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import QuestionSchema from "../../validators/QuestionSchema";
import FormError from "../FormError";
import CustomSelect from "../CustomSelect";

interface QuestionProps {
  children?: ReactNode;
  question: Question;
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
    errors: string[] | undefined;
  };
  set: {
    type: SetState<QuestionType>;
    question: SetState<string>;
    required: SetState<boolean>;
    extra: SetState<ExtraFields>;
    edit: SetState<boolean | undefined>;
    errors: SetState<string[] | undefined>;
  };
}

type SubmissionQuestion = {
  [key in QuestionType]: ({ onChange }: SubmissionProps) => JSX.Element;
};

interface SubmissionProps {
  onChange: (value: string) => void;
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
  const newQuestion = /^NEW_[0-9]+/.test(q.id);
  const id = newQuestion ? uuidv4() : q.id;

  // States
  const [type, setType] = useState(q.type);
  const [required, setRequired] = useState(q.required);
  const [extra, setExtra] = useState<ExtraFields>(q.extra);
  const [question, setQuestion] = useState(q.question);
  const [edit, setEdit] = useState(newQuestion ? undefined : false);
  const [errors, setError] = useState<string[]>();

  const ctxInit: QuestionContext = {
    get: { ID: id, type, question, required, extra, edit, MAX_CHOICES, errors },
    set: {
      type: setType,
      question: setQuestion,
      required: setRequired,
      extra: setExtra,
      edit: setEdit,
      errors: setError,
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
      <CustomSelect
        items={types}
        onChange={onChange}
        defaultValue={types[0].value}
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
    value: value[1],
  }));

  const value = get.extra.dateType;
  const defaultValue = dateTypes.find((v) => v.value === value);

  function onChange(value: string) {
    const dateType = value as DateType;
    set.extra({ dateType });
  }

  return (
    <div className="form-group">
      <label htmlFor={`${get.ID}_dateType`}>Field type</label>
      <CustomSelect
        items={dateTypes}
        onChange={onChange}
        defaultValue={defaultValue?.value || dateTypes[0].value}
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

function EditWrapper({ children }: PropsWithChildren) {
  const { get, set } = useQuestionContext();
  if (get.edit !== false)
    return <div className="flex flex-col gap-4">{children}</div>;

  function onClick() {
    set.edit(true);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-400">{QuestionTypeEnum[get.type]}</span>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">{get.question}</h2>
        <button className="btn-text" onClick={onClick}>
          <EditOutlined />
        </button>
      </div>
    </div>
  );
}

function EditSave({ onSave }: { onSave: (question: Question) => void }) {
  const { get, set } = useQuestionContext();

  if (get.edit === false) return null;

  function onClick() {
    const { ID, extra, question, required, type } = get;
    const data: Question = { id: ID, question, required, type, extra };
    const validation = QuestionSchema.safeParse(data);

    const success = validation.success;
    if (!success) {
      const errors = validation.error.flatten().fieldErrors;
      const errorsList = Object.keys(errors).map((key) => {
        return errors[key as keyof typeof errors]![0];
      });
      set.errors(errorsList);
    } else {
      set.edit(false);
      set.errors(undefined);

      onSave(validation.data as Question);
    }
  }

  return (
    <button type="submit" className="btn-primary" onClick={onClick}>
      Save
    </button>
  );
}

function EditDel({ onDelete }: { onDelete: () => void }) {
  return (
    <button className="btn-danger" onClick={onDelete}>
      Delete
    </button>
  );
}

function EditError() {
  const { get } = useQuestionContext();
  return <FormError errors={get.errors} />;
}

// Form question components
function SubmissionShortAnswer({ onChange }: SubmissionProps) {
  const { get } = useQuestionContext();

  function handleOnChange({ target }: InputChangeEvent) {
    onChange(target.value);
  }

  return (
    <div className="form-group">
      <input
        id={get.ID}
        type="text"
        required={get.required}
        onChange={handleOnChange}
      />
    </div>
  );
}

function SubmissionParagraph({ onChange }: SubmissionProps) {
  const { get } = useQuestionContext();

  function handleOnChange({ target }: TextAreaChangeEvent) {
    onChange(target.value);
  }

  return (
    <div className="form-group">
      <textarea
        id={get.ID}
        rows={3}
        required={get.required}
        onChange={handleOnChange}
      />
    </div>
  );
}

function SubmissionNumber({ onChange }: SubmissionProps) {
  const { get } = useQuestionContext();

  function handleOnChange({ target }: InputChangeEvent) {
    onChange(target.value);
  }

  return (
    <div className="form-group">
      <input
        id={get.ID}
        type="number"
        required={get.required}
        onChange={handleOnChange}
      />
    </div>
  );
}

function SubmissionDate({ onChange }: SubmissionProps) {
  const { get } = useQuestionContext();

  function handleOnChange({ target }: InputChangeEvent) {
    onChange(target.value);
  }

  return (
    <div className="form-group">
      <input
        id={get.ID}
        type={get.extra.dateType}
        required={get.required}
        onChange={handleOnChange}
      />
    </div>
  );
}

function SubmissionEmail({ onChange }: SubmissionProps) {
  const { get } = useQuestionContext();

  function handleOnChange({ target }: InputChangeEvent) {
    onChange(target.value);
  }

  return (
    <div className="form-group">
      <input
        id={get.ID}
        type="email"
        required={get.required}
        onChange={handleOnChange}
        placeholder="example@gmail.com"
      />
    </div>
  );
}

function SubmissionDropdown({ onChange }: SubmissionProps) {
  const { get } = useQuestionContext();
  const [other, setOther] = useState(false);

  // Get choices
  const items = get.extra.choices!.map((value) => ({ label: value, value }));
  if (get.extra.other) items?.push({ label: "Other", value: "other" });

  function handleOnSelect(value: string) {
    const other = value === "other";
    setOther(other);
    onChange(other ? "" : value);
  }

  function handleOnOtherChange({ target }: InputChangeEvent) {
    onChange(target.value);
  }

  function renderOther() {
    if (!other) return null;
    return (
      <div className="form-group">
        <input
          id={`${get.ID}_other`}
          type="text"
          required={get.required}
          onChange={handleOnOtherChange}
          placeholder="Other"
        />
      </div>
    );
  }

  return (
    <>
      <CustomSelect
        items={items}
        required={get.required}
        onChange={handleOnSelect}
      />
      {renderOther()}
    </>
  );
}

function SubmissionMCQ({ onChange }: SubmissionProps) {
  const { get } = useQuestionContext();
  const [otherValue, setOtherValue] = useState<string>("");
  const [, updateState] = useState({});
  const ref = useRef<HTMLInputElement[]>([]);
  const forceUpdate = useCallback(() => updateState({}), []);

  const maxChoices = get.extra.maxChoices!;
  const type = maxChoices > 1 ? "checkbox" : "radio";
  const hasOther = get.extra.other;
  const checkedCount = ref.current.reduce(
    (prev, curr) => prev + +curr.checked,
    0
  );
  const choices = [...get.extra.choices!];
  if (hasOther) choices.push("Other");

  const setRef = (index: number) => {
    return (e: HTMLInputElement) => (ref.current[index] = e);
  };

  function handleOnChange(other = otherValue) {
    let values = ref.current.reduce((prev, curr) => {
      const value = choices[+curr.value];
      const checked = curr.checked;
      if (checked && value === "Other") return prev + `,${other}`;
      return prev + (curr.checked ? `,${value}` : "");
    }, "");
    onChange(values.length ? values.substring(1) : "");
  }

  function renderOther() {
    if (!hasOther) return null;
    const index = ref.current.length - 1;

    return (
      <div className="form-group">
        <input
          id={`${get.ID}_other`}
          style={{ padding: "2px 10px" }}
          type="text"
          placeholder="Other"
          required={ref.current[index]?.checked && get.required}
          disabled={
            !ref.current[index]?.checked &&
            maxChoices! > 1 &&
            checkedCount === maxChoices
          }
          onChange={({ target }) => {
            setOtherValue(target.value);
            handleOnChange(target.value);
          }}
          onClick={() => {
            ref.current[index].checked = true;
            forceUpdate();
          }}
        />
      </div>
    );
  }

  function renderChoices() {
    const otherIndex = choices.length - 1;

    function handleOnSelect({ target }: InputChangeEvent) {
      const value = +target.value;
      if (hasOther && value === otherIndex) onChange(otherValue);
      else {
        if (type === "radio") onChange(choices[value]);
        else handleOnChange();
      }
    }

    return choices.map((choice, i) => {
      const label = <label htmlFor={`${get.ID}_choice_${i}`}>{choice}</label>;

      return (
        <div className="flex gap-2" key={i}>
          <input
            type={type}
            required={!checkedCount && get.required}
            className="accent-primary"
            name={get.ID}
            id={`${get.ID}_choice_${i}`}
            onChange={handleOnSelect}
            value={i}
            ref={setRef(i)}
            disabled={
              !ref.current[i]?.checked &&
              maxChoices! > 1 &&
              checkedCount === maxChoices
            }
          />
          {hasOther && i === choices.length - 1 ? renderOther() : label}
        </div>
      );
    });
  }

  return <ul className="flex flex-col w-full gap-3">{renderChoices()}</ul>;
}

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
  Wrapper: EditWrapper,
  Save: EditSave,
  Del: EditDel,
  Error: EditError,
};

const submission: SubmissionQuestion = {
  SHORT_ANSWER: SubmissionShortAnswer,
  PARAGRAPH: SubmissionParagraph,
  NUMBER: SubmissionNumber,
  DATE: SubmissionDate,
  EMAIL: SubmissionEmail,
  DROPDOWN: SubmissionDropdown,
  MCQ: SubmissionMCQ,
};

export function Submission({ onChange }: SubmissionProps) {
  const { get } = useQuestionContext();
  const Element = submission[get.type];
  return <Element onChange={onChange} />;
}
