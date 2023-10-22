interface NewForm {
  title: string;
  description?: string;
  coverImg?: FileList;
}

interface Form extends NewForm {
  id: string;
  title: string;
  description?: string;
  coverImg?: File;
  sections?: any[];
  public?: boolean;
}
