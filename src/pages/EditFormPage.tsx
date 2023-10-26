import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useReducer } from "react";
import { initialState, reducer } from "../reducers/formReducer";
import FormSection from "../components/FormSection";

const form: NewForm = {
  title: "",
  description: "",
  coverImg: undefined,
  isPublic: false,
  sections: [],
};

const EditFormPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleAddSection = () => dispatch({ type: "ADD_SECTION" });

  return (
    <div className="flex flex-col gap-6 w-fit">
      {/* Form info section */}
      <section className="form-section">
        <div className="section-header">
          <input
            type="text"
            placeholder="Form title"
            defaultValue={form.title}
          />
        </div>
        <div className="section-body">
          <div className="form-group">
            <textarea
              rows={3}
              className="resize-none"
              placeholder="Form description"
            />
          </div>

          <hr />

          <label className="file-upload">
            <input
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.svg"
            />
            <UploadOutlined className="text-xl" />
            <span>Cover image</span>
            <span className="text-sm text-gray-700">
              Recomended size 820 x 312
            </span>
          </label>
        </div>
      </section>

      {state.sections.map(({ title, questions, id }) => (
        <FormSection
          dispatch={dispatch}
          title={title}
          key={id}
          id={id}
          questions={questions}
        />
      ))}

      <button
        onClick={handleAddSection}
        className="flex items-center w-full gap-3 p-3 text-black bg-white shadow-lg"
      >
        <PlusOutlined />
        Add new section
      </button>
    </div>
  );
};

export default EditFormPage;
