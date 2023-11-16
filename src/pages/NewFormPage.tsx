import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormProvider, { Edit } from "../components/Form/Form";
import useRequest from "../hooks/useRequest";
import { useMutation, useQueryClient } from "react-query";

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

const formInit: NewForm = {
  title: "My form",
  description: "",
  isPublic: false,
  sections: [],
};

const NewFormPage = () => {
  const [form] = useState<NewForm>(formInit);

  const navigate = useNavigate();
  const request = useRequest();
  const queryClient = useQueryClient();

  const saveFormMutation = useMutation({
    mutationFn: async (body: NewForm) => {
      return request<Form>(`/forms/new`, { body, method: "post" })();
    },
    onError: () => {
      alert("Failed to save form");
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["forms", data.data.id], data.data);
      queryClient.invalidateQueries(["forms"]);
      navigate("/dashboard/forms");
    },
  });

  const handleSaveForm = async (form: NewForm) => {
    saveFormMutation.mutate(form);
  };

  return (
    <FormProvider form={form}>
      <Edit.FormInfo />
      <Edit.Sections />
      <Edit.AddSection />
      <Edit.Error />
      <Edit.Save onSave={handleSaveForm} />
    </FormProvider>
  );
};

export default NewFormPage;
