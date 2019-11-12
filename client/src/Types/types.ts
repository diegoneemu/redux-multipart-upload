export type ApplicationState = {
  uploadId?: string;
  percentage: number;
  name?: string;
  size: number;
  type?: string;
  numParts: number;
  currentPart: number;
  partSize: number;
  file?: File;
  uploaded: number;
};

export type FileInfo = {
  name: String;
  size: number;
  numParts: number;
};
