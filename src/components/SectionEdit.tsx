import { ReactNode, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import QuestionEdit from "../Form/QuestionEdit";
import { createPortal } from "react-dom";

interface Section {
  id: string;
  title: string;
  questions: Question[];
}

interface SectionEditProps {
  section: Section;
  autoScroll?: boolean;
  onDelete?: () => void;
  update: (section: Section) => void;
}

function newQuestion(): Question {
  return {
    id: `NEW_${Date.now()}`,
    question: "",
    type: "SHORT_ANSWER",
    required: false,
    extra: {},
  };
}

const SectionEdit = ({
  section: { id, questions, title },
  onDelete,
  autoScroll,
}: SectionEditProps) => {
  const initQuestion = questions.length ? questions : [newQuestion()];
  const initSection: Section = { id, questions: initQuestion, title };
  const [section, setSection] = useState(initSection);
  const [modal, setModal] = useState<ReactNode | null>(null);
  const [mounted, setMounted] = useState(false);
  // const [errors, setErrors] = useState<string[] | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && !mounted) setMounted(true);

    if (!autoScroll || mounted) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [section.questions.length]);

  function handleChangeTitle({ target }: InputChangeEvent) {
    setSection((old) => ({ ...old, title: target.value }));
  }

  function handleAddQuestion() {
    setSection((old) => {
      const questions = [...old.questions, newQuestion()];
      return { ...old, questions };
    });
  }

  function handleDelSection() {
    if (onDelete) onDelete();
    setModal(null);
  }

  function DelSectionButton() {
    if (!onDelete) return null;

    return (
      <button onClick={() => setModal(<DeleteModal />)} className="btn-danger">
        Delete Section
      </button>
    );
  }

  function DeleteModal() {
    return (
      <Modal hideOneClickOutside hide={() => setModal(null)}>
        <h4>Are you sure you want to delete this section ?</h4>
        <div className="flex justify-end gap-2 mt-3">
          <button onClick={() => handleDelSection()} className="btn-danger">
            Delete
          </button>
          <button onClick={() => setModal(false)} className="btn">
            Cancel
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <section className="form-section">
      <div className="section-header">
        <input
          id={`${id}_section_title`}
          type="text"
          placeholder="Section title"
          value={title}
          onChange={handleChangeTitle}
        />
      </div>

      <div className="section-body">
        {section.questions.map((question) => {
          let onDelete;
          if (section.questions.length < 2) onDelete = undefined;
          else {
            onDelete = () => {
              setSection((old) => {
                const questions = old.questions.filter(
                  (q) => q.id !== question.id
                );
                return { ...old, questions };
              });
            };
          }

          return (
            <QuestionEdit
              key={question.id}
              question={question}
              sectionId={section.id}
            />
          );
        })}

        <button onClick={handleAddQuestion} className="btn-primary">
          Add new question
        </button>
        <DelSectionButton />
      </div>
      <div ref={ref} />
      {modal && createPortal(modal, document.querySelector("#modal")!)}
    </section>
  );
};

export default SectionEdit;
