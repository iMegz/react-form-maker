import Select from "../Select";
import { QuestionType } from "../../lib/enums";
import { useState } from "react";
import { useQuestion } from "./useQuestion";
import {
  ChoicesInputs,
  DateTypeSelect,
  MaxChoicesInput,
  OtherCheckbox,
  RequiredCheckbox,
} from "./extraFields";

const MAX_CHOICES = 4;

interface QuestionTemplateProps {
  question: Question;
  onDelete: () => void;
}

const types = Object.entries(QuestionType).map((value) => ({
  label: value[1],
  value: value[0],
}));

const QuestionTemplate = ({ question, onDelete }: QuestionTemplateProps) => {
  const [q, setQ] = useState<Question>(question);
  const { onChange, onChoiceAction } = useQuestion(setQ);
  const id = question.id;

  const extraFieldsProps = { onChange, id };

  function renderExtrafields() {
    switch (q.type) {
      case "DATE":
        return (
          <>
            <DateTypeSelect {...extraFieldsProps} value={q.dateType} />
            <RequiredCheckbox {...extraFieldsProps} value={!!q.required} />
          </>
        );

      case "MCQ":
      case "DROPDOWN":
        return (
          <>
            {/* Choices */}
            <ChoicesInputs
              choices={q.choices}
              id={id}
              onChoiceAction={onChoiceAction}
              MAX_CHOICES={MAX_CHOICES}
            />

            {/* Max choices input */}
            {q.type === "MCQ" && (
              <MaxChoicesInput
                {...extraFieldsProps}
                value={q.maxChoices}
                max={q.choices.length}
              />
            )}

            {/* Required and other checkboxes */}
            <div className="flex gap-2">
              <RequiredCheckbox {...extraFieldsProps} value={!!q.required} />
              <OtherCheckbox {...extraFieldsProps} value={!!q.other} />
            </div>
          </>
        );

      default:
        return <RequiredCheckbox {...extraFieldsProps} value={!!q.required} />;
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-3 border-b border-b-gray-300 animate-fade-in">
      {/* Type select input */}
      <div className="form-group">
        <label htmlFor="question">Type</label>
        <Select items={types} selectedIndex={0} onSelect={onChange("type")} />
      </div>

      {/* Question input */}
      <div className="form-group">
        <label htmlFor="question">Question</label>
        <input
          id="question"
          onChange={onChange("question")}
          value={q.question}
        />
      </div>

      {renderExtrafields()}

      {/* Save and cancel buttons */}
      <div className="flex items-center justify-end gap-3">
        <button className="btn-primary">Save</button>
        <button className="btn-danger" onClick={onDelete}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default QuestionTemplate;
