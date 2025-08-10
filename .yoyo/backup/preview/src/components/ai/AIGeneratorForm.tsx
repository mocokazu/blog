"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createPost } from "@/services/postService";
import { PostFormData } from "@/types/post";
import { useRouter } from "next/navigation";
import MarkdownEditor from "@/components/editor/MarkdownEditor";

function excerptFromMarkdown(md: string, max = 160) {
  const text = md
    .replace(/```[\s\S]*?```/g, " ") // code blocks
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, " ") // images
    .replace(/\[[^\]]*\]\([^\)]*\)/g, " ") // links
    .replace(/[#>*_`~\-]+/g, " ") // markdown symbols
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, max);
}

type Provider = "openai" | "gemini";

export default function AIGeneratorForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [provider, setProvider] = useState<Provider>("gemini");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedPostId, setSavedPostId] = useState<string | null>(null);

  // AIO/LLMO: ペルソナ/トーン/読者/キーワード
  const [persona, setPersona] = useState(
    "オーナーの一人称『私』。挑戦的×実務的。AIを最大活用し、最小労力で成果を出す視点。読者に行動を促す締め。"
  );
  const [tone, setTone] = useState("読みやすく、実務的で親しみやすい");
  const [audience, setAudience] = useState("テック志向の個人開発者・個人事業主");
  const [keywordsInput, setKeywordsInput] = useState("");

  // SEOフィールド
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  const [outline, setOutline] = useState<string[]>([]);

  const canGenerate = prompt.trim().length > 0 && !loading;
  const canSave = title.trim().length > 0 && content.trim().length > 0 && !saving && !!user;

  async function handleGenerate() {
    setError(null);
    setLoading(true);
    setSavedPostId(null);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          provider,
          persona,
          tone,
          audience,
          keywords: keywordsInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "生成に失敗しました");
      }
      const data = (await res.json()) as {
        title: string;
        content: string;
        seoTitle?: string;
        seoDescription?: string;
        seoKeywords?: string[];
        outline?: string[];
      };
      setTitle(data.title || "");
      setContent(data.content || "");
      setSeoTitle((data.seoTitle || data.title || "").trim());
      setSeoDescription((data.seoDescription || "").trim());
      const kws = Array.isArray(data.seoKeywords)
        ? data.seoKeywords.filter((k) => k && k.trim())
        : [];
      setSeoKeywords(kws);
      setKeywordsInput(kws.join(", "));
      setOutline(Array.isArray(data.outline) ? data.outline : []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "生成に失敗しました";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveDraft() {
    if (!user) {
      setError("ログインが必要です");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const kwForSave = seoKeywords.length
        ? seoKeywords
        : keywordsInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

      const postData: PostFormData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerptFromMarkdown(content),
        published: false,
        tags: kwForSave,
        seoTitle: (seoTitle || title).trim(),
        seoDescription: (seoDescription || excerptFromMarkdown(content)).trim(),
        seoKeywords: kwForSave,
      };
      const createdId = await createPost(
        postData,
        user.uid,
        user.email || "",
        user.displayName || user.email || ""
      );
      setSavedPostId(createdId);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "下書き保存に失敗しました";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  function goEdit() {
    if (savedPostId) {
      router.push(`/dashboard/posts/edit/${savedPostId}`);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">AIライター（最小実装）</h1>

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600">プロバイダー</label>
        <select
          className="select select-bordered px-3 py-2 rounded border"
          value={provider}
          onChange={(e) => setProvider(e.target.value as Provider)}
        >
          <option value="openai">OpenAI (GPT-4o-mini)</option>
          <option value="gemini">Gemini (2.5-flash)</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-600">ペルソナ</label>
          <textarea
            className="w-full border rounded p-2 min-h-[80px]"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-600">トーン</label>
          <input
            className="w-full border rounded p-2"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-600">想定読者</label>
          <input
            className="w-full border rounded p-2"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-600">キーワード（カンマ区切り）</label>
          <input
            className="w-full border rounded p-2"
            placeholder="例: Next.js, Firebase, 個人開発"
            value={keywordsInput}
            onChange={(e) => setKeywordsInput(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-600">プロンプト</label>
        <textarea
          className="w-full border rounded p-3 min-h-[140px]"
          placeholder="例: Next.js 14 と Firebase を使ったブログの作り方を初心者向けに解説して"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
          onClick={handleGenerate}
          disabled={!canGenerate}
        >
          {loading ? "生成中..." : "生成する"}
        </button>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="space-y-2">
        <label className="text-sm text-gray-600">タイトル</label>
        <input
          className="w-full border rounded p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="生成されたタイトルを調整できます"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-600">本文（Markdown）</label>
        <MarkdownEditor
          value={content}
          onChange={setContent}
          placeholder="生成された本文を編集できます（Markdown対応・プレビュー可・画像アップロード可）"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-600">SEO タイトル</label>
          <input
            className="w-full border rounded p-2"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="検索結果に表示されるタイトル"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-600">SEO 説明</label>
          <textarea
            className="w-full border rounded p-2 min-h-[80px]"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="検索結果の説明文（120-160文字目安）"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm text-gray-600">SEO キーワード（カンマ区切り）</label>
          <input
            className="w-full border rounded p-2"
            value={keywordsInput}
            onChange={(e) => setKeywordsInput(e.target.value)}
          />
        </div>
      </div>

      {outline.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm text-gray-600">アウトライン</label>
          <ul className="list-disc pl-6 text-sm text-gray-700">
            {outline.map((h, i) => (
              <li key={`outline-${i}`}>{h}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          className="btn bg-gray-800 text-white px-4 py-2 rounded disabled:opacity-60"
          onClick={handleSaveDraft}
          disabled={!canSave}
        >
          {saving ? "保存中..." : "下書きとして保存"}
        </button>
        {savedPostId && (
          <button className="underline text-blue-700" onClick={goEdit}>
            保存済みの下書きを編集する
          </button>
        )}
      </div>

      {!user && (
        <p className="text-sm text-gray-500">保存にはログインが必要です。</p>
      )}
    </div>
  );
}
