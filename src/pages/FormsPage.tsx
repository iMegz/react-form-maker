import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import Modal from "../components/Modal";
import { createPortal } from "react-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from "../components/Spinner";

const FormsPage = () => {
  const [modal, setModal] = useState<ReactNode | null>(null);
  const [forms, setForms] = useState<Form[] | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  // Get forms from backend
  useEffect(() => {
    async function fetchData() {
      const path = `${import.meta.env.VITE_API}/forms/get/all`;
      const token = await getAccessTokenSilently();
      const authorization = `Bearer ${token}`;
      const res = await axios.get(path, { headers: { authorization } });
      return res;
    }

    fetchData()
      .then((res) => setForms(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Delete form
  async function deleteForm(id: string, cb: Function) {
    // Delete it from frontend
    const index = forms!.findIndex((v) => v.id == id);
    forms!.splice(index, 1);
    setModal(null);

    // Delete it from backend
    const path = `${import.meta.env.VITE_API}/forms/del/${id}`;
    const token = await getAccessTokenSilently();

    const authorization = `Bearer ${token}`;
    await axios.delete(path, { headers: { authorization } });
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

  // Render forms table
  function renderForms() {
    if (!forms) {
      return (
        <tr>
          <td colSpan={3}>
            <Spinner className="flex justify-center" />
          </td>
        </tr>
      );
    }

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

    return forms.map(({ id, title, description }) => (
      <tr key={id}>
        <td className="text-xs md:text-base">
          <Link to={"/forms/edit/" + id}>{title}</Link>
        </td>

        <td className="hidden lg:table-cell ">
          <p className="line-clamp-2">{description}</p>
        </td>

        <td className="flex gap-0 md:gap-2">
          <Link to={"/forms/preview/" + id}>
            <button className="btn-text-primary">
              <EyeFilled />
              <span className="hidden md:inline">Preview</span>
            </button>
          </Link>

          <Link to={"/forms/responses/" + id}>
            <button className="btn-text">
              <UnorderedListOutlined />
              <span className="hidden md:inline">Responses</span>
            </button>
          </Link>

          <Link to={"/forms/edit/" + id}>
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
        </td>
      </tr>
    ));
  }

  return (
    <div>
      <h1>Forms</h1>

      <Link to="/forms/edit">
        <button className="btn-primary">Create new form</button>
      </Link>

      <div className="mt-6 table-wrapper">
        <table className="overflow-x-auto">
          <thead>
            <tr>
              <th scope="col">Form title</th>
              <th scope="col" className="hidden lg:table-cell">
                Description
              </th>
              <th scope="col">Actions</th>
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
