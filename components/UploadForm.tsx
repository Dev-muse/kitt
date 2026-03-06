"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Upload,
  ImagePlus,
  X,
  FileText,
  Loader2,
} from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UploadSchema } from "@/lib/zod";
import {
  voiceOptions,
  voiceCategories,
  DEFAULT_VOICE,
} from "@/lib/constants";
import type { BookUploadFormValues } from "@/types";

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: "",
      author: "",
      voice: DEFAULT_VOICE,
    },
  });

  const pdfFile = form.watch("pdf");
  const coverImage = form.watch("coverImage");

  const onSubmit = async (data: BookUploadFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement actual upload logic
      console.log("Form submitted:", data);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {isSubmitting && <LoadingOverlay />}
    
      <div className="new-book-wrapper">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* ── PDF File Upload ── */}
            <FormField
              control={form.control}
              name="pdf"
              render={({ field }) => (
                <FormItem>
                  <label className="form-label">Book PDF File</label>
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) field.onChange(file);
                    }}
                  />
                  {pdfFile ? (
                    <div className="upload-dropzone upload-dropzone-uploaded flex-row !h-auto !p-4 gap-3">
                      <FileText className="w-6 h-6 text-[#663820]" />
                      <span className="upload-dropzone-text !text-[#663820] flex-1 text-left truncate">
                        {pdfFile.name}
                      </span>
                      <button
                        type="button"
                        className="upload-dropzone-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange(undefined);
                          if (pdfInputRef.current) pdfInputRef.current.value = "";
                        }}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="upload-dropzone"
                      onClick={() => pdfInputRef.current?.click()}
                    >
                      <Upload className="upload-dropzone-icon" />
                      <p className="upload-dropzone-text">Click to upload PDF</p>
                      <p className="upload-dropzone-hint">PDF file (max 50MB)</p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Cover Image Upload ── */}
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <label className="form-label">Cover Image (Optional)</label>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) field.onChange(file);
                    }}
                  />
                  {coverImage ? (
                    <div className="upload-dropzone upload-dropzone-uploaded flex-row !h-auto !p-4 gap-3">
                      <ImagePlus className="w-6 h-6 text-[#663820]" />
                      <span className="upload-dropzone-text !text-[#663820] flex-1 text-left truncate">
                        {coverImage.name}
                      </span>
                      <button
                        type="button"
                        className="upload-dropzone-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange(undefined);
                          if (coverInputRef.current) coverInputRef.current.value = "";
                        }}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="upload-dropzone"
                      onClick={() => coverInputRef.current?.click()}
                    >
                      <ImagePlus className="upload-dropzone-icon" />
                      <p className="upload-dropzone-text">
                        Click to upload cover image
                      </p>
                      <p className="upload-dropzone-hint">
                        Leave empty to auto-generate from PDF
                      </p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Title Input ── */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <label className="form-label">Title</label>
                  <input
                    {...field}
                    type="text"
                    placeholder="ex: Rich Dad Poor Dad"
                    className="form-input"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Author Input ── */}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <label className="form-label">Author Name</label>
                  <input
                    {...field}
                    type="text"
                    placeholder="ex: Robert Kiyosaki"
                    className="form-input"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Voice Selector ── */}
            <FormField
              control={form.control}
              name="voice"
              render={({ field }) => (
                <FormItem>
                  <label className="form-label">Choose Assistant Voice</label>

                  {/* Male Voices */}
                  <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Male Voices
                  </p>
                  <div className="voice-selector-options mb-4">
                    {voiceCategories.male.map((key) => {
                      const voice =
                        voiceOptions[key as keyof typeof voiceOptions];
                      const isSelected = field.value === key;
                      return (
                        <label
                          key={key}
                          className={`voice-selector-option ${
                            isSelected
                              ? "voice-selector-option-selected"
                              : "voice-selector-option-default"
                          }`}
                        >
                          <input
                            type="radio"
                            name="voice"
                            value={key}
                            checked={isSelected}
                            onChange={() => field.onChange(key)}
                            className="accent-[#663820]"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-[var(--text-primary)]">
                              {voice.name}
                            </span>
                            <span className="text-xs text-[var(--text-secondary)] leading-tight">
                              {voice.description}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* Female Voices */}
                  <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Female Voices
                  </p>
                  <div className="voice-selector-options">
                    {voiceCategories.female.map((key) => {
                      const voice =
                        voiceOptions[key as keyof typeof voiceOptions];
                      const isSelected = field.value === key;
                      return (
                        <label
                          key={key}
                          className={`voice-selector-option ${
                            isSelected
                              ? "voice-selector-option-selected"
                              : "voice-selector-option-default"
                          }`}
                        >
                          <input
                            type="radio"
                            name="voice"
                            value={key}
                            checked={isSelected}
                            onChange={() => field.onChange(key)}
                            className="accent-[#663820]"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-[var(--text-primary)]">
                              {voice.name}
                            </span>
                            <span className="text-xs text-[var(--text-secondary)] leading-tight">
                              {voice.description}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Submit Button ── */}
            <button type="submit" className="form-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </span>
              ) : (
                "Begin Synthesis"
              )}
            </button>
          </form>
        </Form>
      </div>
    </>
  );
};

/* ── Loading Overlay ── */
const LoadingOverlay = () => (
  <div className="loading-wrapper">
    <div className="loading-shadow-wrapper bg-white">
      <div className="loading-shadow">
        <Loader2 className="loading-animation w-12 h-12 text-[#663820]" />
        <h3 className="loading-title">Processing Your Book</h3>
        <div className="loading-progress">
          <div className="loading-progress-item">
            <span className="loading-progress-status" />
            <span className="text-[var(--text-secondary)]">
              Uploading files and analyzing content...
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default UploadForm;
