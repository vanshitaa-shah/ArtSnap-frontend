export type Art = {
  artName: string;
  artistName: string;
  description: string;
  id: string;
  imageUrl: string;
};

export interface ImageCaptureInputProps {
  isFormReset: boolean;
  onImageCapture: (file: File | null) => void;
}
