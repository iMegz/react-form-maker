import { PlusOutlined } from "@ant-design/icons";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { initialState, reducer } from "../reducers/formReducer";
import FormSection from "../components/Form/FormSection";
import FileUpload from "../components/FileUpload";
import { NewFormSchema } from "../validators/formValidators";
import FormError from "../components/Form/FormError";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";

const EditFormPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedForm, setLoadedForm] = useState(false);
  const [errors, setErrors] = useState<any>();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      const token = await getAccessTokenSilently();
      const path = `${import.meta.env.VITE_API}/forms/get/${id}`;
      const authorization = `Bearer ${token}`;
      return axios.get(path, { headers: { authorization } });
    }

    if (id) {
      fetchData().then((res) => {
        dispatch({ type: "INIT", payload: res.data });
        setLoadedForm(true);
      });
    }
  }, []);

  if (id && !loadedForm)
    return (
      <div className="grid w-full h-full place-items-center">
        <div className="flex flex-col items-center">
          <h1>Loading Form</h1>
          <Spinner />
        </div>
      </div>
    );

  // Form submit
  const handleSaveForm = async () => {
    // Disable save button
    setIsLoading(true);

    try {
      // Validate form data
      const validation = NewFormSchema.safeParse(state);

      if (validation.success) {
        // Remove any previous error messages
        setErrors(undefined);

        let coverImg = validation.data.coverImg; // FIX this by saving images
        if (coverImg instanceof File) coverImg = URL.createObjectURL(coverImg);
        const data = { ...validation.data, coverImg };

        // Get jwt token
        const token = await getAccessTokenSilently();
        const authorization = `Bearer ${token}`;

        // Send to server (will fix it to send images too)
        const endPoint = id ? `edit/${id}` : "new";
        const path = `${import.meta.env.VITE_API}/forms/${endPoint}`;
        const method = id ? "patch" : "post";

        const res = await axios[method](path, data, {
          headers: { authorization },
        });

        if (res.statusText === "OK") navigate("/forms");
        else alert("Failed to save form");
      } else {
        const errors = validation.error.flatten().fieldErrors;
        setErrors(errors);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  // Chagne handlers
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

  const handleSetPublic = ({
    target: { checked: payload },
  }: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_PUBLIC", payload });
  };

  // JSX
  return (
    <div className="form-holder">
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
            src={
              typeof state.coverImg === "string" ? state.coverImg : undefined
            }
          />
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="public"
              className="accent-primary"
              checked={state.isPublic}
              onChange={handleSetPublic}
            />
            <label htmlFor="public">Public</label>
          </div>
        </div>
      </section>

      {/* Form questions sections */}
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
        className="flex items-center w-full gap-3 p-3 mb-2 text-black bg-white shadow-lg"
      >
        <PlusOutlined />
        Add new section
      </button>
      {/* Errors */}
      {errors && <FormError<NewForm> errors={errors} />}
      <button
        className="mt-2 btn-primary w-fit"
        disabled={isLoading}
        onClick={handleSaveForm}
      >
        Save
      </button>
    </div>
  );
};

export default EditFormPage;
