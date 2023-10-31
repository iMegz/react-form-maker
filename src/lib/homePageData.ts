import {
  EditOutlined,
  FormOutlined,
  PieChartOutlined,
} from "@ant-design/icons";

export const features = [
  {
    title: "Data Crafting",
    description:
      "Craft and design data forms with ease. Our intuitive platform allows you to create custom forms tailored to your needs.",
    icon: FormOutlined,
  },
  {
    title: "Analyze Insights",
    description:
      "Dive deep into your collected data and gain valuable insights. Our analysis tools make it easy to uncover trends and patterns.",
    icon: PieChartOutlined,
  },
  {
    title: "Customization",
    description:
      "Tailor your surveys and forms to match your brand's identity. Enjoy the freedom to customize every aspect.",
    icon: EditOutlined,
  },
];

export const plans = [
  {
    title: "Free",
    price: 0,
    features: [
      { title: "Forms", value: "5" },
      { title: "Responses", value: "50 / Form" },
      { title: "MCQ max choices", value: "4" },
      { title: "Form analysis", value: true },
      { title: "Advanced analysis", value: false },
      { title: "Customer service", value: "24 / 7" },
    ],
  },
  {
    title: "Premium",
    price: 50,
    features: [
      { title: "Forms", value: "Unlimited" },
      { title: "Responses", value: "Unlimited" },
      { title: "MCQ max choices", value: "Unlimited" },
      { title: "Form analysis", value: true },
      { title: "Advanced analysis", value: true },
      { title: "Customer service", value: "24 / 7" },
    ],
  },
];
