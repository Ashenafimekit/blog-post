export interface BlogCardProps {
  id?: string;
  title?: string;
  content?: string;
  authorName?: string;
  authorEmail?: string;
  images?: {
    id: string;
    mimetype: string;
    size: number;
    fileName: string;
    path: string;
    originalName: string;
  }[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
