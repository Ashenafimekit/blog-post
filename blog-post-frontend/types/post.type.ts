export interface PostType {
  id?: number;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
    published?: boolean;
  };
  images?: {
    id: string;
    mimetype: string;
    size: number;
    fileName: string;
    path: string;
    originalName: string;
  }[];
}
