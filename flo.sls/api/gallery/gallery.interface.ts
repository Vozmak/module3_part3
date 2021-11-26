export interface Gallery {
  objects: Array<string | undefined>;
  page: number;
  total: number;
}

export interface Query {
  page?: string;
  limit?: string;
  filter?: string;
}

export interface Image {
  imageName: string;
}

export interface UploadValues {
  Path?: string;
  Status: 'OPEN' | 'CLOSED';
  Metadata?: string;
  SubClip: true | false;
}

export interface PreSignerUrlResponse {
  message: string;
}
