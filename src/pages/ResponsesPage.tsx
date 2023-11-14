import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import NotFound from "./NotFound";
import { DeleteFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";

const ResponsesPage = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState<FormResponses | null | undefined>(
    null
  );
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    async function fetchData() {
      const path = `${import.meta.env.VITE_API}/response/get/all/${id}`;
      const token = await getAccessTokenSilently();
      const authorization = `Bearer ${token}`;
      const res = await axios.get(path, { headers: { authorization } });

      return res;
    }

    fetchData()
      .then((res) => setResponses(res.data))
      .catch((err) => {
        if (err.response.status === 404) setResponses(undefined);
      });
  }, []);

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

    async function onDelete() {
      setResponses((old) => {
        const responses = old!.responses.filter(({ id }) => id !== response.id);
        return { ...old!, responses };
      });

      const path = `${import.meta.env.VITE_API}/response/del/${response.id}`;
      const token = await getAccessTokenSilently();
      const authorization = `Bearer ${token}`;
      const res = await axios.delete(path, { headers: { authorization } });
      return res;
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

  if (responses === null) return <LoadingPage />;
  if (responses === undefined) return <NotFound />;

  function renderResponses() {
    const data = responses!.responses;

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
