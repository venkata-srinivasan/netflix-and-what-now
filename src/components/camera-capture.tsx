"use client";

import { useCamera } from "@/hooks/use-camera";
import { Button } from "@/components/ui/button";
import { Camera, X, Upload } from "lucide-react";
import { useRef } from "react";

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  capturedImage: string | null;
  onClear: () => void;
}

export function CameraCapture({ onCapture, capturedImage, onClear }: CameraCaptureProps) {
  const { videoRef, isCapturing, startCamera, captureFrame, stopCamera } = useCamera();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    const dataUrl = captureFrame();
    if (dataUrl) onCapture(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onCapture(result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  if (capturedImage) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-border">
        <img
          src={capturedImage}
          alt="Captured TV screen"
          className="w-full h-auto max-h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={onClear}
            className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-2 left-2">
          <span className="text-xs bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-muted-foreground font-mono">
            TV screenshot attached
          </span>
        </div>
      </div>
    );
  }

  if (isCapturing) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-border">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto max-h-64 object-cover"
        />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          <Button onClick={handleCapture} size="sm" className="gap-2">
            <Camera className="h-4 w-4" />
            Capture
          </Button>
          <Button onClick={stopCamera} size="sm" variant="secondary">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={startCamera}
        variant="outline"
        size="sm"
        className="gap-2 text-muted-foreground"
      >
        <Camera className="h-4 w-4" />
        Point at TV
      </Button>
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
        size="sm"
        className="gap-2 text-muted-foreground"
      >
        <Upload className="h-4 w-4" />
        Upload screenshot
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
}
