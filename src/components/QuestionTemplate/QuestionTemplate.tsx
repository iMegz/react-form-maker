import Select from "../Select";
import { QuestionType } from "../../lib/enums";
import { useState } from "react";
import { useQuestion } from "../../hooks/useQuestion";
import {
  ChoicesInputs,
  DateTypeSelect,
  MaxChoicesInput,
  OtherCheckbox,
  RequiredCheckbox,
} from "./extraFields";
import { QuestionSchema } from "../../validators/formValidators";
import { EditOutlined } from "@ant-design/icons";
import FormError from "../Form/FormError";

const MAX_CHOICES = 4;

interface QuestionTemplateProps {
  question: Question;
  onDelete: () => void;
  onSave: (question: Question) => void;
  editMode?: boolean;
  canDelete: boolean;
}

type Edit = {
  mode: boolean;
  type: boolean;
};

const types = Object.entries(QuestionType).map((value) => ({
  label: value[1],
  value: value[0],
}));

const QuestionTemplate = ({
  question,
  onDelete,
  onSave,
  editMode,
  canDelete,
}: QuestionTemplateProps) => {
  const [q, setQ] = useState<Question>(question);
  const [edit, setEdit] = useState<Edit>({
    mode: editMode ?? true,
    type: editMode ?? true,
  });

  const { onChange, onChoiceAction } = useQuestion(setQ);
  const [errors, setErrors] = useState<any>();

  const id = question.id;
  const extraFieldsProps = { onChange, id };

  function handleOnSave() {
    const validation = QuestionSchema.safeParse(q);
    if (validation.success) {
      setEdit({ mode: false, type: false });
      setErrors(undefined);
      onSave(validation.data as Question);
    } else {
      const errors = validation.error.flatten().fieldErrors;
      setErrors(errors);
    }
  }

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

  function renderTypeSelect() {
    if (edit.type)
      return (
        <div className="form-group">
          <label htmlFor="question">Type</label>
          <Select items={types} selectedIndex={0} onSelect={onChange("type")} />
        </div>
      );
  }

  function renderEditMode() {
    if (edit.mode)
      return (
        <>
          {/* Errors */}
          {errors && <FormError<Question> errors={errors} />}

          {/* Type select input */}
          {renderTypeSelect()}

          {/* Question input */}
          <div className="form-group">
            <label htmlFor="question">Question</label>
            <textarea
              rows={2}
              id="question"
              onChange={onChange("question")}
              value={q.question}
              className="resize-none"
            />
          </div>

          {/* Extra fields */}
          {renderExtrafields()}

          {/* Save and cancel buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              className="btn-primary"
              onClick={handleOnSave}
            >
              Save
            </button>
            {canDelete && (
              <button className="btn-danger" onClick={onDelete}>
                Delete
              </button>
            )}
          </div>
        </>
      );

    return (
      <div className="flex flex-col gap-2">
        <span className="text-gray-400">{QuestionType[q.type]}</span>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{q.question}</h2>
          <button
            className="btn-text"
            onClick={() => setEdit((prev) => ({ ...prev, mode: true }))}
          >
            <EditOutlined />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-3 border-b border-b-gray-300 animate-fade-in">
      {renderEditMode()}
    </div>
  );
};

export default QuestionTemplate;
