export interface BlogCardProps {
  id?: string;
  title?: string;
  content?: string;
  authorName?: string;
  authorEmail?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
