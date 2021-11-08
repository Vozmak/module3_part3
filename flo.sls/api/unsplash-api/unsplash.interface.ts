export interface ImagesList {
  total_pages: number;
  result: Array<{
    id: string;
    likes: number;
    url: string;
  }>;
}
