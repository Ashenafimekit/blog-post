export interface PostType {
  id?: number;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
    published?: boolean;
  };
}
