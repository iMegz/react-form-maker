import { DeleteFilled, UploadOutlined } from "@ant-design/icons";
import { ChangeEvent, useRef, useState } from "react";

interface FileUploadProps {
  title: string;
  info?: string;
  accept?: string;
  multiple?: boolean;
  onChange?: (file: File | null) => void;
}

const FileUpload = ({ title, info, accept, onChange }: FileUploadProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  function handleOnChange({ target }: ChangeEvent<HTMLInputElement>) {
    const file = target.files?.[0] || null;
    setFile(file);
    if (onChange) onChange(file);
  }

  function deleteFile() {
    ref.current?.value && (ref.current.value = "");
    setFile(null);
    if (onChange) onChange(null);
  }

  function renderPreview() {
    if (file) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="h-full rounded-md"
        />
      );
    } else {
      return (
        <>
          <UploadOutlined className="text-xl" />
          <span>{title}</span>
          {info && <span className="text-sm text-gray-700">{info}</span>}
        </>
      );
    }
  }

  return (
    <div className="relative">
      {file && (
        <DeleteFilled
          className="absolute btn-text-danger top-1 right-1"
          onClick={deleteFile}
        />
      )}

      <label
        className={`bg-white cursor-pointer flex flex-col w-full h-[183px] items-center justify-center rounded-md border-2 border-gray-500 ${
          file ? "" : " border-dashed"
        }`}
      >
        <input
          type="file"
          className="hidden"
          accept={accept}
          ref={ref}
          onChange={handleOnChange}
        />
        {renderPreview()}
      </label>
    </div>
  );
};

export default FileUpload;
