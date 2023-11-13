import Question, { Submission } from "./Question";

interface QuestionSubmissionProps {
  question: Question;
  onChange: (value: string) => void;
}

const QuestionSubmission = ({
  question,
  onChange,
}: QuestionSubmissionProps) => {
  return (
    <Question question={question}>
      <Submission onChange={onChange} />
    </Question>
  );
};

export default QuestionSubmission;
