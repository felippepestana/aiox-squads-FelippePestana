"use client";

import { useRef, useState, useEffect } from "react";
import { Camera, X, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  label: string;
  description: string;
  required?: boolean;
  captured?: string; // base64 or blob URL
  onCapture: (file: File, preview: string) => void;
  onRemove: () => void;
}

export default function CameraCapture({
  label,
  description,
  required = false,
  captured,
  onCapture,
  onRemove,
}: CameraCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile via user agent for capture attribute
    const ua = navigator.userAgent || "";
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(ua));
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      onCapture(file, preview);
    };
    reader.readAsDataURL(file);

    // Reset so the same file can be re-selected
    e.target.value = "";
  }

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-sm font-medium">
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {captured && (
          <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
        )}
      </div>

      {captured ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={captured}
            alt={label}
            className="h-[150px] w-[200px] rounded-md border object-cover"
          />
          <div className="mt-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-[44px] flex-1 text-xs"
              onClick={() => inputRef.current?.click()}
            >
              <RotateCcw className="mr-1.5 h-4 w-4" />
              Refazer
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="min-h-[44px] text-xs"
              onClick={onRemove}
            >
              <X className="mr-1.5 h-4 w-4" />
              Remover
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="min-h-[48px] w-full gap-2 border-dashed text-sm"
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="h-5 w-5" />
          Tirar Foto
        </Button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        {...(isMobile ? { capture: "environment" } : {})}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
