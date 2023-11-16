import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  LinkOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ReactNode, useState } from "react";
import Modal from "../components/Modal";
import { createPortal } from "react-dom";
import Spinner from "../components/Spinner";
import useRequest from "../hooks/useRequest";
import { useMutation, useQuery, useQueryClient } from "react-query";

const MAX_FREE_FORMS = 5;

const FormsPage = () => {
  const [modal, setModal] = useState<ReactNode | null>(null);
  const request = useRequest();
  const queryClient = useQueryClient();

  const formsStatsQuery = useQuery({
    queryFn: request<FormStats>("/stats/forms"),
    queryKey: ["forms", "responses"],
    staleTime: 30_000, // 30 seconds
  });

  const subscriptionQuery = useQuery({
    queryFn: request<Subscription>("/stats/sub"),
    queryKey: ["subscription"],
  });

  const formsQuery = useQuery({
    queryFn: request<Form[]>("/forms"),
    queryKey: ["forms"],
  });

  const deleteFormMutation = useMutation({
    mutationFn: (id: string) => {
      return request(`/forms/${id}`, { method: "delete" })();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["forms"]);
    },
  });

  // Delete form
  async function deleteForm(id: string, cb: Function) {
    setModal(null);
    deleteFormMutation.mutate(id);
    cb();
  }

  // Delete form modal component
  function DeleteModal({ title, id }: { title: string; id: string }) {
    const [isLoading, setIsLoading] = useState(false);
    return (
      <Modal hideOneClickOutside hide={() => setModal(null)}>
        <h4>
          Are you sure you want to delete
          <span className="font-bold"> {title}</span> ? This action is
          irreversible ?
        </h4>
        <div className="flex justify-end gap-2 mt-3">
          <button
            disabled={isLoading}
            onClick={() => {
              setIsLoading(true);
              deleteForm(id, () => setIsLoading(false));
            }}
            className="btn-danger"
          >
            Delete
          </button>
          <button onClick={() => setModal(false)} className="btn">
            Cancel
          </button>
        </div>
      </Modal>
    );
  }

  function copyLink(id: string) {
    const path = `${import.meta.env.VITE_ORIGIN}/form/${id}`;
    return () => navigator.clipboard.writeText(path);
  }

  // Render forms table
  function renderForms() {
    if (formsQuery.isLoading) {
      return (
        <tr>
          <td colSpan={3}>
            <Spinner className="flex justify-center" />
          </td>
        </tr>
      );
    }

    if (formsQuery.isError)
      return (
        <tr>
          <td colSpan={3}>
            <div className="flex justify-center text-danger">
              Failed to retrieve forms
            </div>
          </td>
        </tr>
      );

    const forms = formsQuery.data?.data!;

    if (!forms.length) {
      return (
        <tr>
          <td colSpan={3}>
            <span className="block text-lg text-center text-slate-400">
              You didn't create any forms yet
            </span>
          </td>
        </tr>
      );
    }

    return forms.map(({ id, title, description, isPublic }) => (
      <tr key={id}>
        <td className="text-xs md:text-base">
          <Link to={"edit/" + id}>{title}</Link>
        </td>

        <td className="hidden lg:table-cell">
          <p className="line-clamp-2">{description}</p>
        </td>

        <td className="flex flex-col items-center ">
          <div className="flex gap-1">
            <Link to={"preview/" + id}>
              <button className="btn-text-primary">
                <EyeFilled />
                <span className="hidden md:inline">Preview</span>
              </button>
            </Link>

            <Link to={"edit/" + id}>
              <button className="btn-text-warning">
                <EditFilled />
                <span className="hidden md:inline">Edit</span>
              </button>
            </Link>

            <button
              className="btn-text-danger"
              onClick={() => setModal(<DeleteModal id={id} title={title} />)}
            >
              <DeleteFilled />
              <span className="hidden md:inline">Delete</span>
            </button>
          </div>

          <div className="flex gap-2">
            <Link to={"responses/" + id}>
              <button className="btn-text-success">
                <UnorderedListOutlined />
                <span className="hidden md:inline">View responses</span>
              </button>
            </Link>

            <button
              className="btn-text"
              onClick={copyLink(id)}
              disabled={!isPublic}
              title={!isPublic ? "Form is not public" : ""}
            >
              <LinkOutlined />
              <span className="hidden md:inline">Copy Link</span>
            </button>
          </div>
        </td>
      </tr>
    ));
  }

  function renderCreateNewForm() {
    if (!(subscriptionQuery.data && formsStatsQuery.data)) return <Spinner />;
    const sub = subscriptionQuery.data.data.subscription;
    const forms = formsStatsQuery.data.data.forms;
    if (sub === "Free" && forms >= MAX_FREE_FORMS) return null;
    return (
      <Link to="new">
        <button className="btn-primary">Create new form</button>
      </Link>
    );
  }

  return (
    <div>
      <h1>Forms</h1>

      {renderCreateNewForm()}

      <div className="mt-6 table-wrapper">
        <table className="overflow-x-auto">
          <thead>
            <tr>
              <th scope="col">Form title</th>
              <th scope="col" className="hidden lg:table-cell">
                Description
              </th>
              <th scope="col" className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>{renderForms()}</tbody>
        </table>
      </div>

      {modal && createPortal(modal, document.querySelector("#modal")!)}
    </div>
  );
};

export default FormsPage;
