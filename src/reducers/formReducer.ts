import { v4 as uuidv4 } from "uuid";

type EditableForm = NewForm & { id?: string };

export type Actions =
  | "INIT"
  | "CHANGE_TITLE"
  | "CHANGE_DESCRIPTION"
  | "CHANGE_COVER_IMG"
  | "SET_PUBLIC"
  | "ADD_SECTION"
  | "DEL_SECTION"
  | "CHANGE_SECTION_TITLE"
  | "ADD_QUESTION"
  | "DEL_QUESTION"
  | "SAVE_QUESTION";

export type Action = { type: Actions; payload?: any };

export const initialState: EditableForm = {
  title: "My form",
  description: "",
  coverImg: undefined,
  isPublic: false,
  sections: [],
};

export function genNewQuestion() {
  return {
    id: uuidv4(),
    type: "SHORT_ANSWER",
    question: "",
  } as Question;
}

type QuestionIndex = {
  sectionId: string;
  questionId: string;
};

function getIndex(arr: any[], id: string) {
  const index = arr.findIndex((e: any) => e.id === id);
  if (index === -1) throw new Error("Element not found");
  return index;
}

export function reducer(
  state: EditableForm,
  { type, payload }: Action
): EditableForm {
  switch (type) {
    case "INIT": {
      const form = payload as EditableForm;
      return { ...form };
    }

    // Form info
    case "CHANGE_TITLE": {
      const title = payload as string;
      return { ...state, title };
    }

    case "CHANGE_DESCRIPTION": {
      const description = payload as string;
      return { ...state, description };
    }

    case "CHANGE_COVER_IMG": {
      const coverImg = (payload as File) || undefined;
      return { ...state, coverImg };
    }

    case "SET_PUBLIC": {
      const isPublic = payload as boolean;
      return { ...state, isPublic };
    }

    // Sections
    case "ADD_SECTION": {
      const newState = { ...state };
      newState.sections = [
        ...state.sections,
        { id: uuidv4(), title: "", questions: [genNewQuestion()] },
      ];
      return newState;
    }

    case "DEL_SECTION": {
      if (state.sections.length < 2) return state;
      const newState = { ...state };
      const sectionId = payload as string;
      newState.sections = state.sections.filter(({ id }) => id !== sectionId);
      return newState;
    }

    case "CHANGE_SECTION_TITLE": {
      const newState = { ...state };
      const { title, sectionId } = payload as {
        title: string;
        sectionId: string;
      };
      newState.sections = state.sections.map((section) => {
        return section.id === sectionId ? { ...section, title } : section;
      });
      return newState;
    }

    // Questions
    case "ADD_QUESTION": {
      const newState = { ...state };
      const sectionId = payload as string;

      newState.sections = state.sections.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          questions: [...section.questions, genNewQuestion()],
        };
      });

      return newState;
    }

    case "DEL_QUESTION": {
      const newState = { ...state };
      const { sectionId, questionId }: QuestionIndex = payload;

      newState.sections = state.sections.map((section) => {
        if (section.id !== sectionId) return section;
        if (section.questions.length > 1) {
          return {
            ...section,
            questions: section.questions.filter(({ id }) => id !== questionId),
          };
        } else return section;
      });

      return newState;
    }

    // Save question
    case "SAVE_QUESTION": {
      type SaveQuestion = QuestionIndex & { question: Question };
      const newState = { ...state };
      const { sectionId, questionId, question }: SaveQuestion = payload;

      const sectionIndex = getIndex(state.sections, sectionId);
      const section = state.sections[sectionIndex];
      const questionIndex = getIndex(section.questions, questionId);
      newState.sections[sectionIndex].questions[questionIndex] = question;
      return newState;
    }

    default:
      return state;
  }
}
