import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { newFormSchema } from "../validators/formValidators";
import FormError from "../components/FormError";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const NewFormPage = () => {
  const {
    trigger,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<NewForm>({ resolver: zodResolver(newFormSchema) });

  const [coverImg, setCoverImg] = useState<File | null>(null);

  const navigate = useNavigate();

  function onCoverImgChange({ target }: any) {
    const file: File = target.files[0];
    trigger("coverImg").then((validImg) => {
      if (validImg && file) {
        setCoverImg(file);
      } else setCoverImg(null);
    });
  }

  async function submit(data: NewForm) {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (coverImg) formData.append("coverImg", coverImg);

    // Send formData to server

    const id = "a2d6awda5f";
    navigate("/forms/edit/" + id);
  }

  return (
    <div>
      <h1>Create new form</h1>
      {errors && <FormError errors={errors} />}
      <form className="mt-2" onSubmit={handleSubmit(submit)}>
        <div className="form-group">
          <label htmlFor="title">Form title</label>
          <input
            type="text"
            id="title"
            {...register("title")}
            defaultValue="New form"
            onFocus={({ target }) =>
              target.value === "New form" && (target.value = "")
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Form description</label>
          <textarea
            id="description"
            className="resize-none"
            rows={4}
            {...register("description")}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="form-group">
            <label htmlFor="coverImg">Cover image</label>
            <label className="upload-field">
              <input
                id="coverImg"
                className="hidden"
                type="file"
                accept=".png,.jpg,.jpeg,.svg"
                {...register("coverImg", {
                  onChange: onCoverImgChange,
                })}
              />
              <UploadOutlined className="text-xl" />
              <span className="text-base">Upload</span>
            </label>
          </div>
          {coverImg && (
            <div className="relative self-end mb-5">
              <img
                className="image-preview"
                src={URL.createObjectURL(coverImg)}
                alt={coverImg.name}
              />
              <button
                onClick={() => setCoverImg(null)}
                className="absolute btn top-0.5 right-0.5 text-danger"
              >
                <CloseOutlined />
              </button>
            </div>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary">
          Next
        </button>
      </form>
    </div>
  );
};

export default NewFormPage;
