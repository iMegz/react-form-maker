import { DownOutlined, UpOutlined } from "@ant-design/icons";
import useExpand from "../hooks/useExpand";
import { useState } from "react";

interface CustomSelectProps {
  items: { label: string; value: string }[];
  placeholder?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  defaultValue?: string;
}

const CustomSelect = ({
  items,
  placeholder,
  required,
  onChange,
  defaultValue,
}: CustomSelectProps) => {
  const valueToLabel = items.reduce((prev, curr) => {
    prev[curr.value] = curr.label;
    return prev;
  }, {} as any);

  const { ref, expand, setExpand } = useExpand();
  const [value, setValue] = useState<string | undefined>(defaultValue);

  function onSelect(value: string) {
    setValue(value);
    if (onChange) onChange(value);
  }

  const inputRef = (e: HTMLInputElement) => {
    if (required) e?.setCustomValidity(!value ? "Please select an option" : "");
  };

  function toggle() {
    setExpand((old) => !old);
  }

  function renderArrow() {
    if (expand) return <UpOutlined className="ml-auto text-sm" />;
    return <DownOutlined className="ml-auto text-sm" />;
  }

  function Dropdown() {
    if (!expand) return null;
    return (
      <div className="absolute left-0 z-50 grid w-full top-14 animate-expand">
        <ul
          role="listbox"
          title={placeholder}
          className="flex flex-col w-full gap-2 p-2 overflow-hidden bg-white rounded-lg shadow-xl"
        >
          {items.map((item, i) => (
            <li
              key={i}
              onClick={() => onSelect(item.value)}
              className="p-1 capitalize transition-all select-none hover:bg-gray-200"
              role="option"
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative flex items-center w-full p-3 bg-white border border-gray-700 rounded-md outline-none cursor-pointer"
      onClick={toggle}
    >
      <span className="capitalize">
        {(value && valueToLabel[value]) || placeholder || "Select an option"}
      </span>
      <input
        type="text"
        value={value || ""}
        required={required}
        className="absolute opacity-0 -z-10"
        ref={inputRef}
        onChange={() => {}}
      />
      {renderArrow()}
      <Dropdown />
    </div>
  );
};

export default CustomSelect;
