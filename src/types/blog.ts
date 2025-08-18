export interface BlogPost {
  id: number;
  title: string;
  image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  tags: {
    id: number;
    name: string;
  }[];
  summary: string;
  author_email: string;
  slug: string;
}
