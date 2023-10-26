import { v4 as uuidv4 } from "uuid";

export type Actions =
  | "CHANGE_TITLE"
  | "CHANGE_DESCRIPTION"
  | "CHANGE_COVER_IMG"
  | "SET_PUBLIC"
  | "ADD_SECTION"
  | "DEL_SECTION"
  | "ADD_QUESTION"
  | "DEL_QUESTION"
  | "SAVE_QUESTION";
export type Action = { type: Actions; payload?: any };

export const initialState: NewForm = {
  title: "My form",
  description: "",
  coverImg: undefined,
  isPublic: false,
  sections: [],
};

type QuestionIndex = {
  sectionId: string;
  questionId: string;
};

function getIndex(arr: any[], id: string) {
  const index = arr.findIndex((e: any) => e.id === id);
  if (index === -1) throw new Error("Element not found");
  return index;
}

export function reducer(state: NewForm, { type, payload }: Action): NewForm {
  switch (type) {
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
      const coverImg = payload as File;
      return { ...state, coverImg };
    }

    case "SET_PUBLIC": {
      const isPublic = payload as boolean;
      return { ...state, isPublic };
    }

    // Sections
    case "ADD_SECTION": {
      const newState = { ...state };
      const newQuestion: Question = {
        id: uuidv4(),
        type: "SHORT_ANSWER",
        question: "",
      };
      newState.sections = [
        ...state.sections,
        { id: uuidv4(), title: "", questions: [newQuestion] },
      ];
      return newState;
    }

    case "DEL_SECTION": {
      const newState = { ...state };
      const sectionId = payload as string;
      newState.sections = state.sections.filter(({ id }) => id !== sectionId);
      return newState;
    }

    // Questions
    case "ADD_QUESTION": {
      const newState = { ...state };
      const sectionId = payload as string;

      const newQuestion: Question = {
        id: uuidv4(),
        type: "SHORT_ANSWER",
        question: "",
      };

      newState.sections = state.sections.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          questions: [...section.questions, newQuestion],
        };
      });

      return newState;
    }

    case "DEL_QUESTION": {
      const newState = { ...state };
      const { sectionId, questionId }: QuestionIndex = payload;
      console.log(questionId);

      newState.sections = state.sections.map((section) => {
        if (section.id !== sectionId) return section;
        console.log(section);

        return {
          ...section,
          questions: section.questions.filter(({ id }) => id !== questionId),
        };
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
