import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImageCaptureInputProps } from "@/types";

// Component handles both webcam capture and file upload functionality
const ImageCaptureInput: React.FC<ImageCaptureInputProps> = ({
  isFormReset,
  onImageCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Initialize camera on component mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Reset image when form is reset externally
  useEffect(() => {
    handleClear();
  }, [isFormReset]);

  // Initialize webcam stream with user permission
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setHasPermission(true);
    } catch {
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
  };

  // Capture current frame from video stream
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !video) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.style.display = "block";
    video.style.display = "none";
    setIsCaptured(true);

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "captured-image.jpg", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        onImageCapture(file);
      }
    }, "image/jpeg");
  };

  // Handle file selection from device
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onImageCapture(file);
    setPreviewImage(URL.createObjectURL(file));
    setIsCaptured(true);
    if (videoRef.current) videoRef.current.style.display = "none";
  };

  // Clear canvas content
  const clearCanvas = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context?.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      canvasRef.current.style.display = "none";
    }
  };

  // Reset component to initial state
  const handleClear = async () => {
    setIsCaptured(false);
    setPreviewImage(null);
    await startCamera();

    clearCanvas();

    onImageCapture(null);
  };

  return (
    <div className="space-y-4">
      <canvas className="hidden" ref={canvasRef} width={260} height={240} />

      {isCaptured ? (
        <div className="space-y-4">
          {previewImage && (
            <img
              src={previewImage}
              alt="Art preview"
              className="w-[260px] h-[240px] object-cover"
            />
          )}
          <Button
            onClick={handleClear}
            type="button"
            variant="destructive"
            className="w-full"
          >
            Clear Image
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {hasPermission && (
            <div className="relative w-full h-64 bg-slate-200 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex gap-4">
            {hasPermission && (
              <Button
                onClick={captureImage}
                type="button"
                variant="secondary"
                className="flex-1"
              >
                Capture
              </Button>
            )}
            <Button
              variant="secondary"
              type="button"
              className="flex-1"
              asChild
            >
              <label>
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCaptureInput;
