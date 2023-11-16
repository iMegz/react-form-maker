import LoadingPage from "./LoadingPage";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import Form, { Submission } from "../components/Form/Form";
import useRequest from "../hooks/useRequest";
import { useMutation, useQuery } from "react-query";

const FormPage = ({ preview }: { preview?: boolean }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = useRequest();

  const isAuth = preview ? "" : "/unauth";
  const formQuery = useQuery({
    queryFn: request<Form>(`/forms${isAuth}/${id}`, { auth: preview }),
    queryKey: ["form", id],
  });

  const saveResponseMutation = useMutation({
    mutationFn: async (body: FormResponse) => {
      return request("/response", { method: "post", body })();
    },
    onSuccess: () => {
      navigate("/response/sent");
    },
  });

  async function onSave(values: FormResponse) {
    if (preview) navigate("/response/sent");
    else {
      const data: FormResponse = { form: id!, sections: values.sections };
      saveResponseMutation.mutate(data);
    }
  }

  if (formQuery.isError) return <NotFound />;
  if (formQuery.isLoading) return <LoadingPage screen />;

  return (
    <div className={!preview ? "min-h-screen py-8 m-auto " : ""}>
      <Form form={formQuery.data?.data!}>
        <Submission.FormInfo />
        <Submission.Questions onSubmit={onSave} />
      </Form>
    </div>
  );
};

export default FormPage;
