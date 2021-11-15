export interface ImagesList {
  total_pages: number;
  result: Array<{
    id: string;
    likes: number;
    url: string;
  }>;
}

export interface ImageItem {
  email: string;
  receiptHandle: string;
  receiveCount: string;
  url: string;
  id: string;
}

export interface UploadBodyImages {
  urls: {
    url: string;
    id: string;
    email?: string;
  }[];
}
