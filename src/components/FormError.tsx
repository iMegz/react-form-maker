const FormError = ({ errors }: { errors?: string[] }) => {
  if (!errors) return null;

  return (
    <div
      className="relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded"
      role="alert"
    >
      <ul className="pl-4 list-disc">
        {errors.map((err) => (
          <li key={err}>{err}</li>
        ))}
      </ul>
    </div>
  );
};

export default FormError;
