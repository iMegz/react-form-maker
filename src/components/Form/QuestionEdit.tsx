import { useQuery } from "react-query";
import useRequest from "../../hooks/useRequest";
import { useFormContext } from "./Form";
import Question, { Edit } from "./Question";

interface QuestionEditProps {
  question: Question;
  sectionId: string;
}

const QuestionEdit = ({ question: q, sectionId }: QuestionEditProps) => {
  const { get, set } = useFormContext();
  const request = useRequest();
  const subscriptionQuery = useQuery({
    queryFn: request<Subscription>("/stats/sub"),
    queryKey: ["subscription"],
  });

  const canDelete = get.ids[sectionId].length > 1;

  function onDelete() {
    const id = q.id;
    set.sections((old) => {
      const sections = old.map((section) => {
        if (section.id !== sectionId) return section;
        const questions = section.questions.filter(
          (question) => question.id !== id
        );
        return { ...section, questions };
      });
      return sections;
    });
  }

  function onSave(question: Question) {
    const id = q.id;
    set.sections((old) => {
      const sections = old.map((section) => {
        if (section.id !== sectionId) return section;
        const questions = section.questions.map((q) =>
          id !== q.id ? q : question
        );
        return { ...section, questions };
      });
      return sections;
    });
  }

  const sub = subscriptionQuery.data?.data.subscription;
  const MAX_CHOICES = sub === "Premium" ? Infinity : undefined;
  return (
    <div className="pb-3 border-b border-b-gray-300 animate-fade-in">
      <Question question={q} MAX_CHOICES={MAX_CHOICES}>
        <Edit.Wrapper>
          <Edit.Error />
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
            <Edit.Save onSave={onSave} />
            {canDelete && <Edit.Del onDelete={onDelete} />}
          </div>
        </Edit.Wrapper>
      </Question>
    </div>
  );
};

export default QuestionEdit;
