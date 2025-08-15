export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  status: "Published" | "Draft" | "Pending Review";
}