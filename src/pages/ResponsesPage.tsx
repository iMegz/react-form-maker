import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const ResponsesPage = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState<FormResponses | null>(null);
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
      .catch((err) => console.log(err));
  }, []);

  if (!responses) return <LoadingPage />;
  console.log(responses);

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
        {data.map((response) => {
          return (
            <div
              key={response.id}
              className="flex flex-col w-64 gap-4 p-6 bg-white shadow-md"
            >
              {response.sections.map((section) => {
                return (
                  <div key={section.id} className="flex flex-col gap-3">
                    <h2 className="text-xl font-bold text-primary">
                      {section.title}
                    </h2>
                    {section.questions.map((question) => {
                      if (
                        question.type === "DROPDOWN" ||
                        question.type === "MCQ"
                      ) {
                        // console.log({ ...question });
                      }

                      let value: string;

                      const type = typeof question.value!;
                      if (type === "string" || type === "number") {
                        value = String(question.value);
                      } else {
                        const cv = question.value! as CheckedValue;
                        const other = cv.checked.other && cv.other;
                        value = other ? cv.other + ", " : "";
                        console.log(value);

                        value = Object.keys(cv.checked).reduce((prev, curr) => {
                          if (curr === "other") return prev;
                          console.log(curr, cv.checked[curr]);

                          return prev + (cv.checked[curr] ? `${curr}, ` : "");
                        }, value);
                        console.log(value);

                        value = value.slice(0, value.length - 2);
                      }

                      return (
                        <div key={question.id}>
                          <h3 className="font-semibold">{question.title}</h3>
                          {value ? (
                            <p>{value}</p>
                          ) : (
                            <p className="text-danger">(Not answerd)</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
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
