"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { postPic } from "@/actions/post-pic";
import { Download, ImagePlus, Trash2, Upload, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/use-image-upload";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/Loader";
import SbibaSun from "@/components/icons/SbibaSun";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const AddPost = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState<string>("male");

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

  // Drag & Drop Handlers
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

  // Upload & Reimagine Logic
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.url, gender, square: true }),
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
      toast.success("Image posted successfully!");
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
    window.URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setResult(null);
    handleRemove();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="group inline-flex items-center gap-2 transition-all duration-300 hover:shadow-md"
          onClick={() => setOpen(true)}
        >
          <SbibaSun className="size-4 transition-transform duration-300 group-hover:scale-110 text-amber-400" />
          <span>Reimagine</span>
        </Button>
      </DialogTrigger>

      {/* Wider Dialog */}
      <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4 mb-6">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full">
              <SbibaSun className="size-8 text-amber-600" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-800">
                Reimagine Your Selfie
              </span>
              <p className="text-sm text-muted-foreground mt-1">
                See yourself in historic Sbiba attire — AI-powered transformation
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {!result ? (
          /* ===== UPLOAD VIEW ===== */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
            {/* ===== LEFT: PREVIEW / DROP AREA ===== */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-slate-800">Preview</h3>

              {!previewUrl ? (
                <div
                  onClick={handleThumbnailClick}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "flex flex-col items-center justify-center h-96 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all duration-200 cursor-pointer hover:bg-slate-100 hover:border-primary/50",
                    isDragging && "border-primary bg-primary/5 scale-[1.02]"
                  )}
                >
                  <div className="text-center px-4 py-8">
                    <div className="mx-auto w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                      <ImagePlus className="w-8 h-8 text-slate-500" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-700 mb-2">
                      Upload Your Photo
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click to select or drag & drop a clear headshot (JPG, PNG)
                    </p>
                    <Button 
                      onClick={handleThumbnailClick}
                      variant="outline"
                      size="sm"
                      className="mx-auto"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Select File
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 shadow-md">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Overlay Controls */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={handleThumbnailClick}
                      className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                      aria-label="Replace image"
                    >
                      <Upload className="h-4 w-4 text-slate-700" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={handleRemove}
                      className="h-9 w-9 rounded-full"
                      aria-label="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> Clear, centered headshots yield the best results.
                  </p>
                </div>
              )}
            </div>

            {/* ===== RIGHT: CONTROLS ===== */}
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Create Your Sbiba Portrait
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upload a selfie and our AI will transform you into historic Sbiba attire.
                </p>
              </div>

              <Input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              {/* Gender Selector */}
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium text-slate-700">
                  Attire Style
                </label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger 
                    id="gender"
                    className="w-full bg-white"
                  >
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male Traditional</SelectItem>
                    <SelectItem value="female">Female Traditional</SelectItem>
                    <SelectItem value="nonbinary">Unisex Style</SelectItem>
                    <SelectItem value="prefer_not_to_say">Surprise Me</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* File Info */}
              {fileName && (
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <p className="text-sm font-medium text-slate-700">Selected File</p>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {fileName}
                  </p>
                </div>
              )}

              {/* Privacy Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800">
                <p className="text-sm">
                  <strong>Privacy Assurance:</strong> Your original image is <strong>automatically deleted</strong> after generating the Sbiba portrait.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto pt-4">
                <Button
                  className="w-full h-12 text-base font-medium transition-all duration-200 hover:shadow-md"
                  onClick={handleUpload}
                  disabled={!file || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader size={20} />
                      Reimagining...
                    </>
                  ) : (
                    <>
                      <SbibaSun className="mr-2 h-5 w-5" />
                      Transform into Sbiba
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* ===== RESULT VIEW ===== */
          <div className="flex flex-col items-center py-4">
            <div className="w-full max-w-2xl">
              <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-lg">
                <Image
                  src={result!}
                  alt="Reimagined Sbiba Portrait"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button 
                  onClick={() => postImage(result!)}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none"
                >
                  {isLoading ? (
                    <>
                      <Loader size={18} />
                      Posting...
                    </>
                  ) : (
                    <>
                      <SbibaSun className="w-4 h-4 mr-2" />
                      Post to Profile
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="ghost"
                  className="flex-1 sm:flex-none"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Another Photo
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddPost;
