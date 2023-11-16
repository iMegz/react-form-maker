import { useRef } from "react";
import { useParams } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import NotFound from "./NotFound";
import { DeleteFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import useRequest from "../hooks/useRequest";
import { useMutation, useQuery, useQueryClient } from "react-query";

const ResponsesPage = () => {
  const { id } = useParams();
  const request = useRequest();
  const queryClient = useQueryClient();

  const responsesQuery = useQuery({
    queryFn: request<FormResponses>(`/response/form/${id}`),
    queryKey: ["responses", "form", id],
    staleTime: 30_000, // 30 seconds
  });

  const deleteResponseMutation = useMutation({
    mutationFn: (id: string) =>
      request(`/response/${id}`, { method: "delete" })(),
    onSuccess: () => {
      queryClient.invalidateQueries(["responses", "form", id]);
      queryClient.invalidateQueries(["forms", "responses"], { exact: true });
    },
  });

  function ResponseQuestion({ question }: { question: ResponseQuestion }) {
    const value = question.value || "(Not answerd)";
    const cn = question.value ? "text-gray-600" : "text-danger";
    return (
      <div>
        <h3 className="font-semibold">{question.title}</h3>
        <p className={cn}>{value}</p>
      </div>
    );
  }

  function ResponseSection({ section }: { section: ResponseSection }) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold text-primary">{section.title}</h2>
        {section.questions.map((question) => (
          <ResponseQuestion question={question} key={question.id} />
        ))}
      </div>
    );
  }

  function FormResponse({ response }: { response: FormResponse }) {
    const ref = useRef<HTMLDivElement>(null);
    const height = ref.current?.scrollHeight;
    const BOX_HEIGHT = 320;

    const trimmed = (height || Infinity) > BOX_HEIGHT ? " trimmed-section" : "";

    function onDelete() {
      deleteResponseMutation.mutate(response.id!);
    }

    return (
      <div>
        <div
          ref={ref}
          className={`flex relative flex-col gap-4 p-6 bg-white shadow-md w-72${trimmed}`}
        >
          <button
            onClick={onDelete}
            className="absolute m-auto btn-text-danger top-1 right-1"
          >
            <DeleteFilled />
          </button>
          {response.sections.map((section) => (
            <ResponseSection key={section.id} section={section} />
          ))}
        </div>
        <Link to={`../response/${response.id}`} state={response}>
          <button className="m-auto btn-text">View</button>
        </Link>
      </div>
    );
  }

  function FormResponses({ responses }: { responses: FormResponse[] }) {
    return responses.map((response) => (
      <FormResponse key={response.id} response={response} />
    ));
  }

  if (responsesQuery.isLoading) return <LoadingPage />;
  if (responsesQuery.isError) return <NotFound />;
  const responses = responsesQuery.data!.data!;

  function renderResponses() {
    const data = responses.responses;

    if (!data.length) {
      return (
        <div className="px-6 py-3 text-lg font-semibold bg-white shadow-md text-slate-400">
          This form got no responses
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-6">
        <FormResponses responses={data} />
      </div>
    );
  }

  return (
    <div>
      <h1>{responses.form} responses</h1>
      {renderResponses()}
    </div>
  );
};

export default ResponsesPage;
