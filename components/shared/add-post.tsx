"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { postPic } from "@/actions/post-pic";
import {
  Download,
  ImagePlus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import SbibaSun from "@/components/icons/SbibaSun";
import Loader from "@/components/ui/Loader";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/use-image-upload";
import { Input } from "@/components/ui/input";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const AddPost = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  const {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  } = useImageUpload({
    onUpload: (url) => console.log(url),
    onFileChange: (file) => setFile(file),
  });

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const fakeEvent = {
          target: {
            files: [file],
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleFileChange(fakeEvent);
      }
    },
    [handleFileChange],
  );

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload image");
      }

      const data = await response.json();

      const reimagineResponse = await fetch("/api/reimagine", {
        method: "POST",
        body: JSON.stringify({ url: data.url }),
      });

      if (!reimagineResponse.ok) {
        const error = await reimagineResponse.json();
        throw new Error(error.message || "Failed to reimagine image");
      }

      const reimagineData = await reimagineResponse.json();
      setResult(reimagineData.url);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to process image",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const postImage = async (imageUrl: string) => {
    try {
      setIsLoading(true);
      await postPic(imageUrl);
      toast.success("Image posted successfully");
      setResult(null);
      setOpen(false);
    } catch (error) {
      console.error("Error posting image:", error);
      toast.error("Error posting image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    const response = await fetch(result);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sbiba.png";
    a.click();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="group inline-flex items-center gap-2" onClick={() => setOpen(true)}>
          <SbibaSun className="size-4 transition-transform duration-300 group-hover:scale-110" />
          <span>Reimagine</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-3">
            <SbibaSun className="size-7 text-amber-600" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold">Reimagine your selfie</span>
              <span className="text-xs text-muted-foreground">See yourself in Sbiba, historically inspired</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        {!result ? (
          <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Slide or click to upload</h3>
                <p className="text-sm text-muted-foreground">Upload your selfie and see how it would look like in Sbiba (JPG, PNG)</p>
              </div>
              <div className="text-xs text-muted-foreground">Tip: use a clear headshot</div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Slide or click to upload</h3>
              <p className="text-sm text-muted-foreground">
                Upload your selfie and see how it would look like in sbiba 1000
                years ago (supported formats: JPG, PNG)
              </p>
            </div>

            <Input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            {!previewUrl ? (
              <div
                onClick={handleThumbnailClick}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "flex h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted",
                  isDragging && "border-primary/50 bg-primary/5",
                )}
              >
                <div className="rounded-full bg-background p-3 shadow-sm">
                  <ImagePlus className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Click to select</p>
                  <p className="text-xs text-muted-foreground">
                    or drag and drop file here
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="group relative h-64 overflow-hidden rounded-lg border">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleThumbnailClick}
                      className="h-9 w-9 p-0"
                      aria-label="Replace image"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleRemove}
                      className="h-9 w-9 p-0"
                      aria-label="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {fileName && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="truncate">{fileName}</span>
                    <button
                      onClick={handleRemove}
                      className="ml-auto rounded-full p-1 hover:bg-muted"
                      aria-label="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            <Image
              src={result}
              alt="Reimagined"
              width={1024}
              height={1024}
              className="object-cover"
            />
          </div>
        )}
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="flex gap-2">
            {result && (
              <Button onClick={handleDownload} variant="outline">
                <Download className="mr-1 h-4 w-4" />
                Download
              </Button>
            )}
            {result && (
              <Button onClick={() => postImage(result)}>
                {isLoading ? (
                  <>
                    <Loader size={18} />
                    <span className="ml-2">Posting...</span>
                  </>
                ) : (
                  <>
                    <SbibaSun className="mr-1 h-4 w-4" />
                    Post
                  </>
                )}
              </Button>
            )}
          </div>

          {!result && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">{fileName}</span>
              <Button
                type="submit"
                onClick={handleUpload}
                disabled={!file || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader size={18} />
                    <span>Reimagining...</span>
                  </div>
                ) : (
                  "Upload"
                )}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPost;
