import { useEffect, useRef, useState } from "react";
import { Action } from "../reducers/formReducer";
import QuestionTemplate from "./QuestionTemplate/QuestionTemplate";
import Modal from "./Modal";
import { createPortal } from "react-dom";
interface FormSectionProps {
  questions: Question[];
  title: string;
  id: string;
  dispatch: React.Dispatch<Action>;
}

const FormSection = ({ questions, title, id, dispatch }: FormSectionProps) => {
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

  const handleChangeTitle = () => {};
  const handleAddQuestion = () => {
    dispatch({ type: "ADD_QUESTION", payload: id });
  };

  const handleDelQuestion = (questionId: string) => {
    return () => {
      const payload = { sectionId: id, questionId };
      dispatch({ type: "DEL_QUESTION", payload });
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
            question={question}
          />
        ))}

        <button onClick={handleAddQuestion} className="btn-primary">
          Add new question
        </button>
        <button
          onClick={() => setModal(<DeleteModal />)}
          className="btn-danger"
        >
          Delete Section
        </button>
      </div>
      <div ref={ref} />
      {modal && createPortal(modal, document.querySelector("#modal")!)}
    </section>
  );
};

export default FormSection;
