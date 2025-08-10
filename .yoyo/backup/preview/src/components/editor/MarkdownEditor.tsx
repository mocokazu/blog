"use client";

import React, { useCallback, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { storage } from "@/lib/firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/contexts/AuthContext";

export type MarkdownEditorProps = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
};

export default function MarkdownEditor({ value, onChange, placeholder, className }: MarkdownEditorProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const insertAtCursor = useCallback((before: string, after: string = "") => {
    const ta = textareaRef.current;
    if (!ta) {
      onChange(value + before + after);
      return;
    }
    const start = ta.selectionStart ?? value.length;
    const end = ta.selectionEnd ?? value.length;
    const selected = value.slice(start, end);
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    // restore cursor selection after React state update in next tick
    requestAnimationFrame(() => {
      const pos = start + before.length + selected.length + after.length;
      ta.focus();
      ta.setSelectionRange(pos, pos);
    });
  }, [onChange, value]);

  const handleFormat = (type: "bold" | "italic" | "code" | "link") => {
    switch (type) {
      case "bold":
        insertAtCursor("**", "**");
        break;
      case "italic":
        insertAtCursor("*", "*");
        break;
      case "code":
        insertAtCursor("``\n", "\n``");
        break;
      case "link":
        insertAtCursor("[テキスト](https://)");
        break;
    }
  };

  const handleUploadImage = async (file: File) => {
    if (!user) {
      setError("画像アップロードにはログインが必要です");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const path = `images/${user.uid}/${Date.now()}_${file.name}`;
      const ref = storageRef(storage, path);
      await uploadBytes(ref, file, { contentType: file.type });
      const url = await getDownloadURL(ref);
      insertAtCursor(`![alt](${url})`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "画像アップロードに失敗しました";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const onPickImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (file) void handleUploadImage(file);
    // reset to allow selecting the same file again
    evt.target.value = "";
  };

  return (
    <div className={"w-full " + (className ?? "") }>
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <button type="button" className="px-2 py-1 border rounded text-sm" onClick={() => handleFormat("bold")}>B</button>
          <button type="button" className="px-2 py-1 border rounded text-sm italic" onClick={() => handleFormat("italic")}>I</button>
          <button type="button" className="px-2 py-1 border rounded text-sm font-mono" onClick={() => handleFormat("code")}>code</button>
          <button type="button" className="px-2 py-1 border rounded text-sm" onClick={() => handleFormat("link")}>link</button>
          <label className="px-2 py-1 border rounded text-sm cursor-pointer">
            {uploading ? "Uploading..." : "image"}
            <input type="file" accept="image/*" className="hidden" onChange={onPickImage} />
          </label>
        </div>
        <div className="flex gap-1">
          <button type="button" className={`px-2 py-1 border rounded-l text-sm ${mode === "edit" ? "bg-gray-200" : ""}`} onClick={() => setMode("edit")}>Edit</button>
          <button type="button" className={`px-2 py-1 border rounded-r text-sm ${mode === "preview" ? "bg-gray-200" : ""}`} onClick={() => setMode("preview")}>Preview</button>
        </div>
      </div>

      {mode === "edit" ? (
        <textarea
          ref={textareaRef}
          className="w-full border rounded p-3 min-h-[260px] font-mono text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <div className="prose max-w-none border rounded p-3 min-h-[260px] bg-white">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || "(プレビューなし)"}</ReactMarkdown>
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
