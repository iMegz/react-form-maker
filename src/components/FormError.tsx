import { FieldErrors } from "react-hook-form";

const FormError = ({ errors }: { errors: FieldErrors }) => {
  const fields = Object.keys(errors) as (keyof typeof errors)[];
  if (fields.length === 0) return null;

  return (
    <div
      className="relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded"
      role="alert"
    >
      <ul className="pl-4 list-disc">
        {fields.map((field, i) => (
          <li key={i}>{errors[field]?.message as string}</li>
        ))}
      </ul>
    </div>
  );
};

export default FormError;
