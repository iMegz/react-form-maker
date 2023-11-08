import { useEffect, useState } from "react";
import LoadingPage from "./LoadingPage";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import NotFound from "./NotFound";
import Form from "../components/Form/Form";

const FormPage = ({ preview }: { preview?: boolean }) => {
  const [form, setForm] = useState<Form | null | undefined>(null);
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const isAuth = preview ? "" : "/unauth";
      const path = `${import.meta.env.VITE_API}/forms${isAuth}/get/${id}`;
      const headers: { authorization?: string } = {};
      if (preview) {
        const token = await getAccessTokenSilently();
        const authorization = `Bearer ${token}`;
        headers.authorization = authorization;
      }
      return axios.get(path, { headers });
    }

    fetchData()
      .then((res) => setForm(res.data))
      .catch(() => setForm(undefined));
  }, []);

  async function onSave(values: FormResponse) {
    if (preview) navigate("/response/sent");
    else {
      const data = { form: id, sections: values.sections };
      const path = `${import.meta.env.VITE_API}/response/new`;
      const token = await getAccessTokenSilently();
      const authorization = `Bearer ${token}`;

      await axios.post(path, data, { headers: { authorization } });
      navigate("/response/sent");
    }
  }

  if (form === undefined) return <NotFound />;
  if (form === null) return <LoadingPage />;

  const cn = `${!preview ? "min-h-screen py-8 m-auto " : ""}form-holder`;
  return (
    <div className={cn}>
      <Form form={form} onSave={onSave} />
    </div>
  );
};

export default FormPage;
