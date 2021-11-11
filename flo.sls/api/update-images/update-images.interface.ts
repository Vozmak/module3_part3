export interface UploadValues {
  Path?: string;
  Status: 'OPEN' | 'CLOSED';
  Metadata?: string;
  SubClip: true | false;
}
