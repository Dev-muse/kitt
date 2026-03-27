"use client";

import useVapi from "@/hooks/useVapi";
import { IBook } from "@/types";
import { Mic, MicOff } from "lucide-react";
import Image from "next/image";
import Transcript from "./Transcript";

const VapiControls = ({ book }: { book: IBook }) => {
  const {
    start,
    stop,
    clearErrors,
    status,
    isActive,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
  } = useVapi(book);

  const { title, author, coverURL, persona } = book;

  const isAiActive =
    isActive &&
    (status === "speaking" ||
      status === "listening" ||
      status === "connecting" ||
      status === "starting");

  return (
    <>
      {/* Section 1: Header card */}
      <div className="vapi-header-card">
        {/* Book cover with mic button */}
        <div className="vapi-cover-wrapper">
          <Image
            src={coverURL}
            alt={`Cover of ${title}`}
            width={120}
            height={180}
            className="vapi-cover-image"
          />
          {/* Mic button overlapping bottom-right of cover */}
          <div className="vapi-mic-wrapper">
            <button
              onClick={isActive ? stop : start}
              disabled={status === "connecting"}
              className={`vapi-mic-btn shadow-md !w-[60px] !h-[60px] ${
                isActive ? "vapi-mic-btn-active" : "vapi-mic-btn-inactive"
              }`}
              type="button"
            >
              {isActive ? (
                <Mic className="size-7 text-[#ccc]" />
              ) : (
                <MicOff className="size-7 text-[#ccc]" />
              )}
            </button>
          </div>
        </div>

        {/* Book info */}
        <div className="flex flex-col justify-center gap-3 flex-1 min-w-0">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight">
            {title}
          </h1>
          <p className="text-base text-[var(--text-secondary)]">by {author}</p>

          {/* Pill badges row */}
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {/* Status indicator */}
            <div className="vapi-status-indicator">
              <span className="vapi-status-dot vapi-status-dot-ready" />
              <span className="vapi-status-text">Ready</span>
            </div>

            {/* Voice label */}
            <div className="vapi-status-indicator">
              <span className="vapi-status-text">
                Voice: {persona || "Default"}
              </span>
            </div>

            {/* Timer */}
            <div className="vapi-status-indicator">
              <span className="vapi-status-text">0:00/15:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Transcript - wrapped in vapi-transcript-wrapper */}
      <div className="vapi-transcript-wrapper">
        <Transcript
          messages={messages}
          currentMessage={currentMessage}
          currentUserMessage={currentUserMessage}
        />
      </div>
    </>
  );
};

export default VapiControls;
