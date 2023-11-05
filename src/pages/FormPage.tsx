import { useEffect, useState } from "react";
import LoadingPage from "./LoadingPage";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import NotFound from "./NotFound";
import Form from "../components/Form/Form";

const FormPage = ({ preview }: { preview?: boolean }) => {
  const [form, setForm] = useState<Form | null | undefined>(null);
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();

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

  function onSave(values: ApplicationForm) {
    if (!preview) console.log(values);
    else console.log("Previe");
  }

  if (form === undefined) return <NotFound />;
  if (form === null) return <LoadingPage />;
  return <Form form={form} onSave={onSave} preview={!!preview} />;
};

export default FormPage;
