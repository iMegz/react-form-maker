import { useLocation, useParams } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { Fragment } from "react";
import NotFound from "./NotFound";
import useRequest from "../hooks/useRequest";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";

function objectIdToDate(id: string) {
  return new Date(parseInt(id.substring(0, 8), 16) * 1000).toLocaleString();
}

const ResponsePage = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const request = useRequest();

  if (!state) {
    var responseQuery = useQuery({
      queryFn: request<FormResponse>(`/response/${id}`),
      queryKey: ["responses", id],
    });
  }

  if (!state) {
    if (responseQuery!.isLoading) return <LoadingPage />;
    if (responseQuery!.isError) return <NotFound />;
  }

  let response: FormResponse;
  if (state) response = state;
  else response = responseQuery!.data?.data!;

  return (
    <div>
      <Link
        className="flex items-center gap-2 mb-2 text-lg w-fit"
        to={`../responses/${response.form}`}
      >
        <ArrowLeftOutlined /> Back to responses
      </Link>
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
