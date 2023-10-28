import { v4 as uuidv4 } from "uuid";

export const form: Form = {
  id: uuidv4(),
  title: "My form",
  description:
    "This is a form to test for the page and rpeview page and how it looks for user",
  isPublic: true,
  sections: [
    {
      id: "955bfd6d-4996-45e8-943a-a32d574c8e7a",
      title: "My Section",
      questions: [
        {
          id: "fbcfa160-3af6-4700-b8a5-72201949bcff",
          type: "PARAGRAPH",
          question: "What is you name ?",
          required: true,
        },
        {
          id: "ac119059-270e-4236-bc8d-5f392c52593f",
          type: "MCQ",
          question: "What is your hobbies ",
          choices: ["Playing football", "Eating", "Drinking"],
          other: true,
          maxChoices: 1,
        },
        {
          id: "ac119059-270e-4236-bc8d-5f392c52593b",
          type: "DROPDOWN",
          question: "Pick this drop down",
          choices: ["Ahmed", "Ali", "Hassan"],
          other: true,
        },
        {
          id: "792d3aca-5a56-45db-a465-1d2d13dd4c97",
          type: "DATE",
          question: "What is your birthday",
          dateType: "date",
        },
        {
          id: "cab4f1e5-542f-46a0-b0e3-4558c3ebcb41",
          type: "EMAIL",
          question: "What is you email",
          required: false,
        },
        {
          id: "8aaae485-5f38-433a-b669-ed38312316d1",
          type: "MCQ",
          question: "Pick the options",
          required: true,
          choices: ["A", "B", "C", "D"],
          maxChoices: 2,
          other: true,
        },
      ],
    },
    {
      id: "7dbc0ce4-b8c9-48ef-8925-4e1681bffc60",
      title: "Section 2",
      questions: [
        {
          id: "d612b6c3-5c9a-47e0-814d-54805f473e9f",
          type: "NUMBER",
          question: "Age ",
        },
        {
          id: "d612b6c3-5c9a-5da3-814d-54805f473e9f",
          type: "SHORT_ANSWER",
          question: "Answer me ?",
        },
      ],
    },
  ],
  coverImg:
    "https://i0.wp.com/plaindesign.com.au/wp-content/uploads/2020/01/Cover-Photo-for-Facebook_-820-x-312-px.jpg?fit=820%2C312&ssl=1",
};

export const forms: Form[] = [
  {
    id: "1",
    title: "My form",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente reprehenderit harum recusandae quasi, ullam aperiam numquam fugiat iste alias corrupti! Laudantium eum voluptas quae soluta aut quibusdam iste similique ratione?",
    sections: [],
    coverImg: "",
  },
  {
    id: "2",
    title: "Quiz form",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi, soluta?",
    sections: [],
    coverImg: "",
  },
  {
    id: "3",
    title: "Feedback form",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla atque qui nostrum debitis aliquam earum a aliquid placeat eaque, eum quia impedit praesentium velit corrupti.",
    sections: [],
    coverImg: "",
  },
];
