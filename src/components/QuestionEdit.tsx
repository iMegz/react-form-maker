import Question, { Edit, Question$, OnValidateResult } from "../lib/Question";

interface QuestionTemplateProps {
  question?: Question$;
  onValidate?: (result: OnValidateResult) => void;
}

const QuestionEdit = ({ question, onValidate }: QuestionTemplateProps) => {
  return (
    <Question question={question}>
      <Edit.Wrapper>
        <Edit.Type />
        <Edit.Question />
        <Edit.DateType />
        <Edit.Choices />
        <Edit.MaxChoices />
        <div className="flex gap-2">
          <Edit.Required />
          <Edit.Other />
        </div>
        <div className="flex items-center justify-end gap-3">
          <Edit.Save onValidate={onValidate} />
        </div>
      </Edit.Wrapper>
    </Question>
  );
};

export default QuestionEdit;
