import { useLocation, useParams } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { Fragment, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import NotFound from "./NotFound";

function objectIdToDate(id: string) {
  return new Date(parseInt(id.substring(0, 8), 16) * 1000).toLocaleString();
}

const ResponsePage = () => {
  const { state } = useLocation();
  const { getAccessTokenSilently } = useAuth0();
  const [response, setResponse] = useState<FormResponse | null | undefined>(
    state
  );
  const { id } = useParams();

  useEffect(() => {
    if (response !== null) return;
    async function fetchData() {
      const path = `${import.meta.env.VITE_API}/response/get/${id}`;
      const token = await getAccessTokenSilently();
      const authorization = `Bearer ${token}`;
      const res = await axios.get(path, { headers: { authorization } });
      return res;
    }

    fetchData()
      .then((res) => setResponse(res.data))
      .catch(() => setResponse(undefined));
  }, []);

  if (response === null) return <LoadingPage />;
  if (response === undefined) return <NotFound />;

  return (
    <div>
      <h1>Response</h1>
      <h2 className="mb-2 font-semibold">@ {objectIdToDate(response.id!)}</h2>
      {response.sections.map((section) => {
        return (
          <Fragment key={section.id}>
            <h2 className="text-xl font-bold text-primary">{section.title}</h2>
            <div className="mt-1 mb-6 table-wrapper">
              <table className="overflow-x-auto">
                <thead>
                  <tr>
                    <th className="lg:w-3/4">Question</th>
                    <th>Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {section.questions.map((question) => {
                    const value = question.value || "(Not answerd)";
                    const cn = question.value
                      ? "!text-gray-600"
                      : "!text-danger";
                    return (
                      <tr key={question.id}>
                        <td>{question.title}</td>
                        <td className={cn}>{value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default ResponsePage;
