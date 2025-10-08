"use client";

import { useState, useRef, useEffect } from "react";
import { X, Image as Img } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploaderProps {
  formData: FormData;
  onChange?: (files: File[]) => void;
  submitted?: boolean;
}

interface PreviewItem {
  file: File;
  url: string;
  id: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  formData,
  onChange,
  submitted,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    if (!selectedFiles.length) return;

    // Add files to state
    setFiles((prev) => [...prev, ...selectedFiles]);

    // Add previews
    const newPreviews: PreviewItem[] = selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);

    // Append files to FormData
    selectedFiles.forEach((file) => formData.append("files", file));
    onChange?.([...files, ...selectedFiles]); // notify parent

    // Clear input
    e.target.value = "";
  };

  const removeFile = (indexToRemove: number) => {
    // Remove from state
    const removedFile = previews[indexToRemove].file;
    setFiles((prev) => prev.filter((file) => file !== removedFile));
    setPreviews((prev) => prev.filter((_, index) => index !== indexToRemove));

    // Remove from FormData
    const currentFiles = formData.getAll("files") as File[];
    formData.delete("files"); // remove all first
    currentFiles
      .filter((file) => file !== removedFile)
      .forEach((file) => formData.append("files", file));

    onChange?.(currentFiles.filter((file) => file !== removedFile) as File[]);

    // Revoke URL
    URL.revokeObjectURL(previews[indexToRemove].url);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  useEffect(() => {
    if (submitted) {
      setFiles([]);
      setPreviews([]);
    }
  }, [submitted]);

  return (
    <div className="w-full ml-0">
      <div className="space-y-4">
        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Select Images Button */}
        <Button
          variant={"secondary"}
          onClick={triggerFileInput}
          className="w-full sm:w-auto"
        >
          <Img /> Upload
        </Button>

        {/* File Previews */}
        {previews.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400">
              Selected Images ({files.length})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {previews.map((preview, index) => (
                <div
                  key={preview.id}
                  className="relative group border rounded-lg overflow-hidden"
                >
                  <Image
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  <Button
                    variant={"destructive"}
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                    {preview.file.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Info */}
        {files.length > 0 && (
          <div className="text-xs text-gray-500 space-y-1">
            {files.map((file, index) => (
              <div key={index} className="flex justify-between">
                <span className="truncate mr-2">{file.name}</span>
                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
