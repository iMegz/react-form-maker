import { PlusOutlined } from "@ant-design/icons";
import { ChangeEvent, useReducer, useState } from "react";
import { initialState, reducer } from "../reducers/formReducer";
import FormSection from "../components/FormSection";
import FileUpload from "../components/FileUpload";
import { NewFormSchema } from "../validators/formValidators";
import FormError from "../components/FormError";

const EditFormPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [errors, setErrors] = useState<any>();

  const handleAddSection = () => {
    dispatch({ type: "ADD_SECTION" });
  };

  const handleChangeTitle = ({
    target: { value: payload },
  }: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "CHANGE_TITLE", payload });
  };

  const handleChangeDescription = ({
    target: { value: payload },
  }: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: "CHANGE_DESCRIPTION", payload });
  };

  const handleChangeCoverImg = (payload: File | null) => {
    dispatch({ type: "CHANGE_COVER_IMG", payload });
  };

  const handleSaveForm = () => {
    const validation = NewFormSchema.safeParse(state);
    if (validation.success) {
      // Send to backend
      setErrors(undefined);
      console.log(validation.data);
    } else {
      const errors = validation.error.flatten().fieldErrors;
      setErrors(errors);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-fit">
      {/* Form info section */}
      <section className="form-section">
        <div className="section-header">
          <input
            type="text"
            placeholder="Form title"
            value={state.title}
            onChange={handleChangeTitle}
          />
        </div>
        <div className="section-body">
          <div className="form-group">
            <textarea
              rows={3}
              className="resize-none"
              placeholder="Form description"
              value={state.description}
              onChange={handleChangeDescription}
            />
          </div>

          <hr />

          <FileUpload
            title="Cover image"
            accept=".jpg,.jpeg,.png,.svg"
            info="Recomended size 820 x 312"
            onChange={handleChangeCoverImg}
          />
        </div>
      </section>

      {state.sections.map(({ title, questions, id }) => (
        <FormSection
          dispatch={dispatch}
          title={title}
          key={id}
          id={id}
          questions={questions}
          canDelete={state.sections.length > 1}
        />
      ))}

      <button
        onClick={handleAddSection}
        className="flex items-center w-full gap-3 p-3 text-black bg-white shadow-lg"
      >
        <PlusOutlined />
        Add new section
      </button>
      {/* Errors */}
      {errors && <FormError<NewForm> errors={errors} />}
      <button className="btn-primary w-fit" onClick={handleSaveForm}>
        Save
      </button>
    </div>
  );
};

export default EditFormPage;
