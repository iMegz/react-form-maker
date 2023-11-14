import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import Form, { Edit } from "../components/Form/Form";
import useRequest from "../hooks/useRequest";

type Section = {
  id: string;
  title: string;
  questions: Question[];
};

interface NewForm {
  title: string;
  description: string;
  isPublic: boolean;
  sections: Section[];
}

interface Form extends NewForm {
  id: string;
}

const formInit: NewForm = {
  title: "My form",
  description: "",
  isPublic: false,
  sections: [],
};

const EditFormPage = () => {
  const [form, setForm] = useState<Form | NewForm>(formInit);
  const { id } = useParams();
  const navigate = useNavigate();
  const request = useRequest();

  useEffect(() => {
    if (id) {
      request(`/forms/get/${id}`).then((res) => {
        const data: Form = res.data;
        setForm(data);
      });
    }
  }, []);

  if (id && !("id" in form)) {
    return (
      <div className="grid w-full h-full place-items-center">
        <div className="flex flex-col items-center">
          <h1>Loading Form</h1>
          <Spinner />
        </div>
      </div>
    );
  }

  const handleSaveForm = async (form: NewForm) => {
    try {
      // Get jwt token
      const endPoint = id ? `edit/${id}` : "new";
      const method = id ? "patch" : "post";
      const res = await request(`/forms/${endPoint}`, { body: form, method });

      if (res.status === 200 || res.status === 201) {
        navigate("/dashboard/forms");
      } else alert("Failed to save form");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form form={form}>
      <Edit.FormInfo />
      <Edit.Sections />
      <Edit.AddSection />
      <Edit.Error />
      <Edit.Save onSave={handleSaveForm} />
    </Form>
  );
};

export default EditFormPage;
