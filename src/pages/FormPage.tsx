import { useEffect, useState } from "react";
import LoadingPage from "./LoadingPage";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import Form, { Submission } from "../components/Form/Form";
import useRequest from "../hooks/useRequest";

const FormPage = ({ preview }: { preview?: boolean }) => {
  const [form, setForm] = useState<Form | null | undefined>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const request = useRequest();

  useEffect(() => {
    const isAuth = preview ? "" : "/unauth";
    request(`/forms${isAuth}/get/${id}`, { auth: preview })
      .then((res) => setForm(res.data))
      .catch(() => setForm(undefined));
  }, []);

  async function onSave(values: FormResponse) {
    if (preview) navigate("/response/sent");
    else {
      const data = { form: id, sections: values.sections };
      await request("/response/new", { method: "post", body: data });
      navigate("/response/sent");
    }
  }

  if (form === undefined) return <NotFound />;
  if (form === null) return <LoadingPage screen />;

  return (
    <div className={!preview ? "min-h-screen py-8 m-auto " : ""}>
      <Form form={form}>
        <Submission.FormInfo />
        <Submission.Questions onSubmit={onSave} />
      </Form>
    </div>
  );
};

export default FormPage;
