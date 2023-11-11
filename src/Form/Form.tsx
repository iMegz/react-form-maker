import { PlusOutlined } from "@ant-design/icons";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "../components/Modal";
import { createPortal } from "react-dom";
import QuestionEdit from "./QuestionEdit";
import FormSchema from "../validators/FromSchema";
import FormError from "../components/FormError";

interface Ids {
  [key: string]: string[];
}

interface FormContext {
  get: {
    formInfo: FormInfo;
    sections: Section[];
    errors: string[] | undefined;
    ids: Ids;
  };
  set: {
    formInfo: SetState<FormInfo>;
    sections: SetState<Section[]>;
    errors: SetState<string[] | undefined>;
  };
}

interface FormProps {
  children?: ReactNode;
  form: Form | NewForm;
}

const ctx = createContext<FormContext | null>(null);

export function useFormContext() {
  const context = useContext(ctx);
  if (!context)
    throw Error("This component must be wrapped inside Form component");
  return context;
}

export default function Form({ children, form }: FormProps) {
  const initFormInfo: FormInfo = {
    id: form.id,
    title: form.title,
    description: form.description,
    isPublic: form.isPublic,
  };

  const [formInfo, setFormInfo] = useState<FormInfo>(initFormInfo);
  const [sections, setSections] = useState<Section[]>(form?.sections || []);
  const [errors, setErrors] = useState<string[] | undefined>(undefined);

  const ids = sections.reduce((prev, curr) => {
    prev[curr.id] = curr.questions.map(({ id }) => id);
    return prev;
  }, {} as Ids);

  const ctxInit: FormContext = {
    get: { formInfo, sections, ids, errors },
    set: { formInfo: setFormInfo, sections: setSections, errors: setErrors },
  };

  return (
    <ctx.Provider value={ctxInit}>
      <div className="form-holder">{children}</div>
    </ctx.Provider>
  );
}

// Edit form components
function EditFormInfo() {
  const { get, set } = useFormContext();
  const { title, isPublic, description } = get.formInfo;

  const handleChangeTitle = ({ target }: InputChangeEvent) => {
    set.formInfo((old) => ({ ...old, title: target.value }));
  };

  const handleChangeDescription = ({ target }: TextAreaChangeEvent) => {
    set.formInfo((old) => ({ ...old, description: target.value }));
  };

  const handleSetPublic = ({ target }: InputChangeEvent) => {
    set.formInfo((old) => ({ ...old, isPublic: target.checked }));
  };

  return (
    <section className="form-section">
      <div className="section-header">
        <input
          type="text"
          placeholder="Form title"
          value={title}
          onChange={handleChangeTitle}
        />
      </div>
      <div className="section-body">
        <div className="form-group">
          <textarea
            rows={3}
            className="resize-none"
            placeholder="Form description"
            value={description}
            onChange={handleChangeDescription}
          />
        </div>

        <hr />
        <div className="flex gap-2">
          <input
            type="checkbox"
            id="public"
            className="accent-primary"
            checked={isPublic}
            onChange={handleSetPublic}
          />
          <label htmlFor="public">Public</label>
        </div>
      </div>
    </section>
  );
}

function EditAddSection() {
  const { set } = useFormContext();

  const handleAddSection = () => {
    set.sections((old) => {
      const section = { id: uuidv4(), title: "", questions: [newQuestion()] };
      return [...old, section];
    });
  };

  return (
    <button
      onClick={handleAddSection}
      className="flex items-center w-full gap-3 p-3 mb-2 text-black bg-white shadow-lg"
    >
      <PlusOutlined />
      Add new section
    </button>
  );
}

function EditSections() {
  const { get } = useFormContext();

  return get.sections.map((section) => (
    <EditSection key={section.id} section={section} />
  ));
}

function EditSection({ section }: { section: Section }) {
  const { get, set } = useFormContext();
  const { id, questions, title } = section;
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (get.formInfo.id && !mounted) setMounted(true);

    if (!get.formInfo.id || mounted) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [questions.length]);

  function handleChangeTitle({ target }: InputChangeEvent) {
    set.sections((old) =>
      old.map((sec) => {
        return sec.id !== id ? sec : { ...section, title: target.value };
      })
    );
  }

  function handleAddQuestion() {
    set.sections((old) => {
      return old.map((section) => {
        if (section.id !== id) return section;
        const question = newQuestion();
        const questions: Question[] = [...section.questions, question];
        return { ...section, questions };
      });
    });
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
        {questions.map((question) => (
          <QuestionEdit
            key={question.id}
            question={question}
            sectionId={section.id}
          />
        ))}

        <button onClick={handleAddQuestion} className="btn-primary">
          Add new question
        </button>
        <EditDelSection id={id} />
      </div>
      <div ref={ref} />
    </section>
  );
}

function EditDelSection({ id }: { id: string }) {
  const { get, set } = useFormContext();
  if (get.sections.length < 2) return null;
  const [modal, setModal] = useState<ReactNode | null>(null);

  function handleDelSection() {
    set.sections((old) => old.filter((section) => section.id !== id));
  }

  function onClick() {
    setModal(<DeleteModal />);
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
    <>
      <button onClick={onClick} className="btn-danger">
        Delete Section
      </button>
      {modal && createPortal(modal, document.querySelector("#modal")!)}
    </>
  );
}

function EditSave({ onSave }: { onSave?: (form: NewForm) => Promise<any> }) {
  const { get, set } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);

  async function onClick() {
    if (onSave) {
      setIsLoading(true);
      const sections = get.sections.map((section) => {
        const questions = section.questions.filter(
          ({ id }) => !/^NEW_[0-9]+/.test(id)
        );
        return { ...section, questions };
      });
      const form: NewForm = { ...get.formInfo, sections };
      const validation = FormSchema.safeParse(form);

      const success = validation.success;
      if (!success) {
        console.log(form);
        console.log(validation.error);

        const errors = validation.error.flatten().fieldErrors;
        const errorsList = Object.keys(errors).map((key) => {
          return errors[key as keyof typeof errors]![0];
        });

        set.errors(errorsList);
        setIsLoading(false);
      } else {
        set.errors(undefined);
        await onSave(validation.data as NewForm);
        setIsLoading(false);
      }
    }
  }

  return (
    <button
      className="mt-2 btn-primary w-fit"
      disabled={isLoading}
      onClick={onClick}
    >
      Save
    </button>
  );
}

function EditError() {
  const { get } = useFormContext();
  return <FormError errors={get.errors} />;
}

export const Edit = {
  FormInfo: EditFormInfo,
  Sections: EditSections,
  AddSection: EditAddSection,
  Save: EditSave,
  Error: EditError,
};

function newQuestion(): Question {
  return {
    id: `NEW_${Date.now()}`,
    question: "",
    required: false,
    type: "SHORT_ANSWER",
    extra: {},
  };
}
