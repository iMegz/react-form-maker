import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Action } from "../reducers/formReducer";
import QuestionTemplate from "./QuestionTemplate/QuestionTemplate";
import Modal from "./Modal";
import { createPortal } from "react-dom";

interface FormSectionProps {
  questions: Question[];
  title: string;
  id: string;
  dispatch: React.Dispatch<Action>;
  canDelete: boolean;
}

const FormSection = ({
  questions,
  title,
  id,
  dispatch,
  canDelete,
}: FormSectionProps) => {
  const [modal, setModal] = useState<React.ReactNode | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [questions.length]);

  function deleteModal() {
    dispatch({ type: "DEL_SECTION", payload: id });
    setModal(null);
  }

  function DeleteModal() {
    return (
      <Modal hideOneClickOutside hide={() => setModal(null)}>
        <h4>Are you sure you want to delete this section ?</h4>
        <div className="flex justify-end gap-2 mt-3">
          <button onClick={() => deleteModal()} className="btn-danger">
            Delete
          </button>
          <button onClick={() => setModal(false)} className="btn">
            Cancel
          </button>
        </div>
      </Modal>
    );
  }

  const handleChangeTitle = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const payload = { title: target.value, sectionId: id };
    dispatch({ type: "CHANGE_SECTION_TITLE", payload });
  };

  const handleAddQuestion = () => {
    dispatch({ type: "ADD_QUESTION", payload: id });
  };

  const handleDelQuestion = (questionId: string) => {
    return () => {
      const payload = { sectionId: id, questionId };
      dispatch({ type: "DEL_QUESTION", payload });
    };
  };

  const handleOnSave = (questionId: string) => {
    return (question: Question) => {
      const payload = { sectionId: id, questionId, question };
      dispatch({ type: "SAVE_QUESTION", payload });
    };
  };

  return (
    <section className="form-section animate-enter-from-top">
      {/* Section header */}
      <div className="section-header">
        <input
          type="text"
          placeholder="Section title"
          value={title}
          onChange={handleChangeTitle}
        />
      </div>

      {/* Section body */}
      <div className="section-body">
        {questions.map((question) => (
          <QuestionTemplate
            key={question.id}
            onDelete={handleDelQuestion(question.id)}
            onSave={handleOnSave(question.id)}
            question={question}
            canDelete={questions.length > 1}
          />
        ))}

        <button onClick={handleAddQuestion} className="btn-primary">
          Add new question
        </button>
        {canDelete && (
          <button
            onClick={() => setModal(<DeleteModal />)}
            className="btn-danger"
          >
            Delete Section
          </button>
        )}
      </div>
      <div ref={ref} />
      {modal && createPortal(modal, document.querySelector("#modal")!)}
    </section>
  );
};

export default FormSection;
