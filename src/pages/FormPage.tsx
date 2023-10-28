import formFields from "../components/FormFields";
import { form } from "../lib/data";

const FormPage = () => {
  return (
    <form className="min-h-screen py-8 m-auto form-holder">
      {/* Form info section */}
      <section className="form-section">
        <div className="section-header">
          <h1>{form.title}</h1>
        </div>
        <img
          className="object-contain w-full"
          src={form.coverImg}
          alt={form.title}
        />
        <div className="section-body">
          <p>{form.description}</p>
        </div>
      </section>

      {/* Form questions sections */}
      {form.sections.map((section) => (
        <section className="form-section" key={section.id}>
          <div className="section-header">
            <h1>{section.title}</h1>
          </div>
          <div className="section-body">
            {section.questions.map((q) => {
              const Element = formFields[q.type];
              return (
                <div
                  key={q.id}
                  className="flex flex-col gap-4 pb-3 border-b border-b-gray-300 last-of-type:border-b-0 last-of-type:pb-0"
                >
                  <div className="flex flex-col gap-2 ">
                    <h2 className="text-lg font-semibold">
                      {q.question}
                      {q.required && (
                        <span className="inline-block ml-1 text-danger">*</span>
                      )}
                    </h2>
                    <Element question={q} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
      <button type="submit" className="btn-primary w-fit">
        Submit
      </button>
    </form>
  );
};

export default FormPage;