type ZodError<T> = { _errors: string[] } & {
  [K in keyof T]: string[];
};

const FormError = <T,>({ errors }: { errors?: ZodError<T> }) => {
  if (!errors) return null;
  const fields = Object.keys(errors) as (keyof typeof errors)[];

  return (
    <div
      className="relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded"
      role="alert"
    >
      <ul className="pl-4 list-disc">
        {fields.map((field, i) => (
          <li key={i}>{errors[field][0] as string}</li>
        ))}
      </ul>
    </div>
  );
};

export default FormError;
