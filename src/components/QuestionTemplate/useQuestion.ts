import { Dispatch, SetStateAction } from "react";

type QuestionSetState = Dispatch<SetStateAction<Question>>;
type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
type ChoiceAction = "add" | "del" | "edit";

interface ExcludeField {
  [key: string]: (keyof Question)[];
}

interface ChangeHandler {
  (value: string | boolean | QuestionType, field: keyof Question): void;
}

export interface OnChange {
  (field: "question" | "maxChoices" | "other" | "required"): (
    e: InputChangeEvent
  ) => void;
  (field: "dateType" | "type"): (value: string) => void;
}

export interface OnChoiceAction {
  (action: ChoiceAction, index: number): any;
}

const excludedFields: ExcludeField = {
  DATE: ["choices", "other", "maxChoices"],
  MCQ: ["dateType"],
  DROPDOWN: ["dateType", "maxChoices"],
};

export function useQuestion(setState: QuestionSetState) {
  const changeHandler: ChangeHandler = (value, field) => {
    setState((oldState) => ({ ...oldState, [field]: value }));
  };

  const typeChangeHandler = (type: QuestionType) => {
    setState((oldState) => {
      const newState = { ...oldState };
      newState.type = type;
      if (type in excludedFields) {
        excludedFields[type].forEach((field) => delete newState[field]);
        switch (type) {
          case "DATE":
            newState.dateType = "date";
            break;
          //@ts-ignore
          case "MCQ":
            newState.maxChoices = 1;
          case "DROPDOWN":
            newState.choices = newState.choices || [""];
            break;
        }
      }
      return newState;
    });
  };

  //@ts-ignore
  const onChange: OnChange = (field) => {
    switch (field) {
      case "question":
      case "maxChoices":
        return (e: InputChangeEvent) => changeHandler(e.target.value, field);
      case "other":
      case "required":
        return (e: InputChangeEvent) => changeHandler(e.target.checked, field);
      case "dateType":
        return (value: string) => changeHandler(value, field);
      case "type":
        return (value: string) => typeChangeHandler(value as QuestionType);
    }
  };

  const onChoiceAction: OnChoiceAction = (action, index) => {
    switch (action) {
      case "add":
        return () => {
          setState((oldState) => {
            // Add new choice after current choice
            const newState = { ...oldState };
            newState.choices = oldState.choices?.flatMap((choice, i) => {
              return i === index ? [choice, ""] : [choice];
            });
            return newState;
          });
        };

      case "del":
        return () => {
          if (!index) return; // Don't delete first choice
          setState((oldState) => {
            const newState = { ...oldState };
            newState.choices = oldState.choices?.filter((_, i) => i !== index);
            return newState;
          });
        };

      case "edit":
        return ({ target }: InputChangeEvent) => {
          setState((oldState) => {
            const newState = { ...oldState };
            newState.choices![index] = target.value;
            return newState;
          });
        };
      default:
        return () => {};
    }
  };

  return { onChange, onChoiceAction };
}
