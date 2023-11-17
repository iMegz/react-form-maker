import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import FormProvider, { Edit } from "../components/Form/Form";
import useRequest from "../hooks/useRequest";
import { useMutation, useQuery, useQueryClient } from "react-query";
import NotFound from "./NotFound";

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

const EditFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = useRequest();
  const queryClient = useQueryClient();
  const formQuery = useQuery({
    queryFn: request<Form>(`/forms/${id}`),
    queryKey: ["forms", id],
  });

  const saveFormMutation = useMutation({
    mutationFn: async (body: NewForm) => {
      return request<Form>(`/forms/${id}`, { body, method: "patch" })();
    },
    onError: () => {
      alert("Failed to save form");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["forms"]);
      navigate("/dashboard/forms");
    },
  });

  if (formQuery.isError) return <NotFound />;
  if (formQuery.isLoading || !formQuery.data?.data) {
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
    saveFormMutation.mutate(form);
  };

  const form = formQuery.data.data;

  return (
    <div className="m-auto max-width">
      <FormProvider form={form}>
        <Edit.FormInfo />
        <Edit.Sections />
        <Edit.AddSection />
        <Edit.Error />
        <Edit.Save onSave={handleSaveForm} />
      </FormProvider>
    </div>
  );
};

export default EditFormPage;
