import { ReactNode, useEffect, useMemo, useState } from "react";
import Select from "../Select";

type QuestionProps = {
  question: Question;
  onChange?: (value: ApplicationAnswerType) => void;
};

// Short answer
const ShortAnswerQuestion = (props: QuestionProps) => {
  const { question, onChange } = props;
  function handleOnChange({ target: { value } }: InputChangeEvent) {
    if (onChange) onChange(value);
  }
  return (
    <div className="form-group">
      <input
        id={question.id}
        type="text"
        required={question.required}
        onChange={handleOnChange}
      />
    </div>
  );
};

// Paragraph
const ParagraphQuestion = (props: QuestionProps) => {
  const { question, onChange } = props;
  function handleOnChange({ target: { value } }: TextAreaChangeEvent) {
    if (onChange) onChange(value);
  }
  return (
    <div className="form-group">
      <textarea
        id={question.id}
        rows={3}
        required={question.required}
        onChange={handleOnChange}
      />
    </div>
  );
};

// Number
const NumberQuestion = (props: QuestionProps) => {
  const { question, onChange } = props;
  function handleOnChange({ target: { value } }: InputChangeEvent) {
    if (onChange) onChange(+value);
  }
  return (
    <div className="form-group">
      <input
        id={question.id}
        type="number"
        required={question.required}
        onChange={handleOnChange}
      />
    </div>
  );
};

// Date answer
const DateQuestion = (props: QuestionProps) => {
  const { question, onChange } = props;
  function handleOnChange({ target: { value } }: InputChangeEvent) {
    if (onChange) onChange(value);
  }
  return (
    <div className="form-group">
      <input
        id={question.id}
        type={question.dateType}
        required={question.required}
        onChange={handleOnChange}
      />
    </div>
  );
};

// Email
const EmailQuestion = (props: QuestionProps) => {
  const { question, onChange } = props;
  function handleOnChange({ target: { value } }: InputChangeEvent) {
    if (onChange) onChange(value);
  }
  return (
    <div className="form-group">
      <input
        id={question.id}
        type="email"
        required={question.required}
        onChange={handleOnChange}
        placeholder="example@gmail.com"
      />
    </div>
  );
};

// Dropdown
const DropdownQuestion = (props: QuestionProps) => {
  const { question, onChange } = props;

  const items = question.choices!.map((choice) => ({
    label: choice,
    value: choice,
  }));
  if (question.other) items.push({ label: "other", value: "other" });

  const selected = question.required ? 0 : undefined;
  const title = question.required ? undefined : "Select option";
  const init = selected === undefined ? null : items[selected].value;

  const [value, setValue] = useState(init);
  const [other, setOther] = useState<boolean>(items[0].value === "other");
  useEffect(() => {
    if (onChange && value) onChange(value);
  }, []);

  function handleOnChange(value: string) {
    setValue(value === "other" ? "" : value);
    setOther(value === "other");
    if (onChange) onChange(value);
  }

  function handleOnChangeOther({ target }: InputChangeEvent) {
    setValue(target.value);
    if (onChange) onChange(target.value);
  }

  return (
    <>
      <Select
        items={items}
        title={title}
        selectedIndex={selected}
        onSelect={handleOnChange}
      />
      {other && (
        <label htmlFor={`${question.id}_other`}>
          <div className="form-group">
            <input
              id={`${question.id}_other`}
              type="text"
              required={question.required}
              onChange={handleOnChangeOther}
              value={value!}
              placeholder="Other"
            />
          </div>
        </label>
      )}
    </>
  );
};

// MCQ
const MCQuestion = (props: QuestionProps) => {
  const { question, onChange } = props;
  const { maxChoices, other, id, choices, required } = question;

  // Field type
  const inputType = maxChoices! > 1 ? "checkbox" : "radio";

  // Inititial state
  const checked = choices!.reduce((prev, curr) => {
    (prev as any)[curr] = false;
    return prev;
  }, {});
  if (other) (checked as any)["other"] = false;
  const init: CheckedValue = {
    checked,
    other: "",
  };

  // States
  const [state, setState] = useState(init);

  onChange;
  useEffect(() => {
    if (onChange) onChange(state);
  }, [state]);

  // Count checked values
  const checkedCount = useMemo(
    () =>
      Object.keys(state.checked).reduce((prev, curr) => {
        return state.checked[curr] ? prev + 1 : prev;
      }, 0),
    [state]
  );

  // Handle onChange
  function handleOnChange({ target }: InputChangeEvent) {
    if (inputType === "radio") {
      setState((oldState) => {
        const newState = { ...oldState };
        for (const key in newState.checked) newState.checked[key] = false;
        newState.checked[target.value] = true;
        return newState;
      });
    } else {
      setState((oldState) => {
        if (target.checked && checkedCount === maxChoices) return oldState;
        const newState = { ...oldState };
        newState.checked[target.value] = target.checked;
        return newState;
      });
    }
  }

  function handleOnClickOther() {
    setState((oldState) => {
      if (oldState.checked["other"]) return oldState;
      const newState = { ...oldState };
      if (inputType === "radio") {
        for (const key in newState.checked) newState.checked[key] = false;
      }
      newState.checked["other"] = true;
      return newState;
    });
  }

  function handleOnOtherChange({ target }: InputChangeEvent) {
    setState((oldState) => ({ ...oldState, other: target.value }));
  }

  // Input props for choices and other choice
  const inputProps = (id: string, value: string, checked: boolean) => ({
    id,
    name: question.id,
    type: inputType,
    className: "accent-primary",
    value,
    checked,
    disabled: !checked && maxChoices! > 1 && checkedCount === maxChoices,
    onChange: handleOnChange,
    required: required && checkedCount < 1,
  });

  // Other option component
  const renderOther = () => {
    if (!other) return null;
    const isChecked = state.checked["other"];
    return (
      <li className="flex items-center gap-2">
        <input {...inputProps(`${id}_other_cb`, "other", isChecked)} />
        <div className="form-group">
          <input
            id={`${id}_other`}
            style={{ padding: "2px 10px" }}
            type="text"
            placeholder="Other"
            value={state.other}
            disabled={
              !isChecked && maxChoices! > 1 && checkedCount === maxChoices
            }
            onChange={handleOnOtherChange}
            onClick={handleOnClickOther}
          />
        </div>
      </li>
    );
  };

  return (
    <ul className="flex flex-col w-full gap-3">
      {choices!.map((choice, i) => {
        const isChecked = state.checked[choice];
        return (
          <li key={i} className="flex items-center gap-2">
            <input {...inputProps(`${id}_${i}`, choice, isChecked)} />
            <label htmlFor={`${id}_${i}`}>{choice}</label>
          </li>
        );
      })}
      {renderOther()}
    </ul>
  );
};

// Export components
type FormFields = {
  [key in QuestionType]: (props: QuestionProps) => ReactNode;
};
const formFields: FormFields = {
  DATE: DateQuestion,
  EMAIL: EmailQuestion,
  MCQ: MCQuestion,
  NUMBER: NumberQuestion,
  PARAGRAPH: ParagraphQuestion,
  SHORT_ANSWER: ShortAnswerQuestion,
  DROPDOWN: DropdownQuestion,
};

export default formFields;
