import { DownOutlined, UpOutlined } from "@ant-design/icons";
import useExpand from "../hooks/useExpand";
import { useState } from "react";

type SelectItem = {
  label: string;
  value: string;
};

interface SelectProps {
  id?: string;
  title?: string;
  items?: SelectItem[];
  selectedIndex?: number;
  onSelect?: (value: string) => void;
}

const Select = ({ items, title, selectedIndex, onSelect, id }: SelectProps) => {
  const init =
    items && selectedIndex !== undefined ? items[selectedIndex] : null;
  const [selection, setSelection] = useState<SelectItem | null>(init);
  const { expand, setExpand, ref } = useExpand();

  function select(index: number) {
    return () => {
      if (items) {
        const item = items[index];
        setSelection(item);
        if (onSelect) onSelect(item.value);
      }
    };
  }

  function toggleDropdown() {
    setExpand((prev) => !prev);
  }

  function renderDropdown() {
    if (!expand) return null;

    return (
      <div className="absolute left-[-0.5%] grid w-[101%] top-14 animate-expand  ">
        <ul className="flex flex-col w-full gap-2 p-2 overflow-hidden bg-white rounded-lg shadow-xl ">
          {items?.map((item, i) => (
            <li
              onClick={select(i)}
              className="p-1 capitalize transition-all select-none hover:bg-gray-200"
              key={item.value}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function renderArrow() {
    return expand ? (
      <UpOutlined className="ml-auto text-sm" />
    ) : (
      <DownOutlined className="ml-auto text-sm" />
    );
  }

  return (
    <div
      className="relative flex items-center w-full p-3 bg-white border border-gray-700 rounded-md outline-none cursor-pointer "
      ref={ref}
      onClick={toggleDropdown}
      id={id}
      role="listbox"
    >
      <span className="capitalize">{selection?.label || title}</span>
      {renderArrow()}
      {renderDropdown()}
    </div>
  );
};

export default Select;
