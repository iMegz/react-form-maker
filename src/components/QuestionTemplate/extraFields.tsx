import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { DateType } from "../../lib/enums";
import Select from "../Select";
import { OnChange, OnChoiceAction } from "./useQuestion";

type ExtraFieldProps = {
  id: string | number;
  onChange: OnChange;
  value: string | boolean | number;
};

type ChoiceBtnProps = {
  onChoiceAction: OnChoiceAction;
  index: number;
};

type ChoiceProps = {
  onChoiceAction: OnChoiceAction;
  choices: string[];
  MAX_CHOICES?: number;
  id: string;
};

const dateTypes = Object.entries(DateType).map((value) => ({
  label: value[1].split("-")[0],
  value: value[0],
}));

export const RequiredCheckbox = ({ onChange, value, id }: ExtraFieldProps) => {
  return (
    <div className="flex gap-2">
      <input
        type="checkbox"
        id={id + "_required"}
        className="accent-primary"
        checked={value as boolean}
        onChange={onChange("required")}
      />
      <label htmlFor={id + "_required"}>Required</label>
    </div>
  );
};

export const OtherCheckbox = ({ onChange, value, id }: ExtraFieldProps) => {
  return (
    <div className="flex gap-2">
      <input
        type="checkbox"
        id={id + "_other"}
        className="accent-primary"
        checked={value as boolean}
        onChange={onChange("other")}
      />
      <label htmlFor={id + "_other"}>Other</label>
    </div>
  );
};

export const DateTypeSelect = ({ onChange, value, id }: ExtraFieldProps) => {
  const selectedindex = dateTypes.findIndex((v) => v.value === value);
  return (
    <div className="form-group">
      <label htmlFor={id + "_dateType"}>Field type</label>
      <Select
        id={id + "_dateType"}
        items={dateTypes}
        onSelect={onChange("dateType")}
        selectedIndex={selectedindex === -1 ? 0 : selectedindex}
      />
    </div>
  );
};

export const MaxChoicesInput = ({
  onChange,
  value,
  id,
  max,
}: ExtraFieldProps & { max: number }) => {
  return (
    <div className="form-group">
      <label htmlFor={id + "_maxChoices"}>Max choices</label>
      <input
        id={id + "_maxChoices"}
        type="number"
        min={1}
        max={max}
        value={value.toString()}
        onChange={onChange("maxChoices")}
      />
    </div>
  );
};

export const ChoicesInputs = ({
  onChoiceAction,
  choices,
  MAX_CHOICES,
  id,
}: ChoiceProps) => {
  return (
    <div className="form-group">
      <label>Choices</label>
      <ul className="flex flex-col gap-3">
        {choices.map((choice, i) => (
          <li key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={choice}
              id={id + "_choice_" + i}
              onChange={onChoiceAction("edit", i)}
            />

            {!MAX_CHOICES ||
              (choices.length < MAX_CHOICES && (
                <AddChoiceButton onChoiceAction={onChoiceAction} index={i} />
              ))}
            {i > 0 && (
              <DelChoiceButton onChoiceAction={onChoiceAction} index={i} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const AddChoiceButton = ({ onChoiceAction, index }: ChoiceBtnProps) => {
  return (
    <button className="btn-text" onClick={onChoiceAction("add", index)}>
      <PlusOutlined />
    </button>
  );
};

const DelChoiceButton = ({ onChoiceAction, index }: ChoiceBtnProps) => {
  return (
    <button className="btn-text-danger " onClick={onChoiceAction("del", index)}>
      <CloseOutlined />
    </button>
  );
};
