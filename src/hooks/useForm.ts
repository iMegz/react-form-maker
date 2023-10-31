import { useState } from "react";

type RegisterdID = { id: string; sectionId: string; type: QuestionType };

export default function useForm(form: Form) {
  const registerdIDs: RegisterdID[] = [];
  const applicationForm: ApplicationForm = { sections: [] };
  applicationForm.sections = form.sections.map((section) => {
    const questions: ApplicationQuestion[] = section.questions.map(
      ({ type, id }) => {
        const sectionId = section.id;
        registerdIDs.push({ id, type, sectionId });
        return {
          sectionId,
          id,
          value: undefined,
          type,
        };
      }
    );
    return { id: section.id, questions };
  });

  const [values, setValues] = useState(applicationForm);

  function register(id: string) {
    const registerdID = registerdIDs.find(
      (registerdID) => registerdID.id === id
    );
    if (!registerdID) throw Error("Invalid id");
    registerdID.type;
    function onChange(value: ApplicationAnswerType) {
      setValues((oldState) => {
        const newState = { ...oldState };
        newState.sections = oldState.sections.map((section) => {
          if (section.id !== registerdID?.sectionId) return section;
          const questions: ApplicationQuestion[] = section.questions.map(
            (question) => {
              if (question.id !== registerdID.id) return question;
              return { ...question, value };
            }
          );
          return { ...section, questions };
        });
        return newState;
      });
    }

    return { onChange };
  }

  return { values, register };
}