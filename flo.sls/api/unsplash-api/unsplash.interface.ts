export interface ImagesList {
  total_pages: number;
  result: Array<{
    id: string;
    likes: number;
    url: string;
  }>;
}

export interface ImageItem {
  url: string;
  id: string;
}

export interface UploadBodyImages {
  urls: Array<ImageItem>;
}
