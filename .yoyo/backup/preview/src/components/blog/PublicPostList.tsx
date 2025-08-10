"use client";

import { useEffect, useMemo, useState } from "react";
import { getPosts } from "@/services/postService";
import type { Post } from "@/types/post";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { filterAndSortPosts } from "@/utils/postFilter";

 

export default function PublicPostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"new" | "old">("new");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        if (mounted) setPosts(data);
      } catch (e) {
        setError("記事の取得に失敗しました");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // URL クエリ -> 状態へ反映（戻る/進むも考慮）
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const t = searchParams.get("tag") ?? "";
    const c = searchParams.get("category") ?? "";
    const s = (searchParams.get("sort") as "new" | "old") ?? "new";
    setQuery(q);
    setTag(t);
    setCategory(c);
    setSort(s);
  }, [searchParams]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      post.tags?.forEach((t) => tags.add(t));
    });
    return Array.from(tags).sort();
  }, [posts]);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    posts.forEach((post) => {
      if (post.category) categories.add(post.category);
    });
    return Array.from(categories).sort();
  }, [posts]);

  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) params.set("q", debouncedQuery);
    else params.delete("q");
    if (tag) params.set("tag", tag);
    else params.delete("tag");
    if (category) params.set("category", category);
    else params.delete("category");
    if (sort !== "new") params.set("sort", sort);
    else params.delete("sort");

    const next = params.toString();
    const prev = searchParams.toString();
    if (next !== prev) {
      router.replace(`${pathname}${next ? `?${next}` : ""}`);
    }
  }, [debouncedQuery, tag, category, sort, pathname, router, searchParams]);

  const filtered = useMemo(() => {
    return filterAndSortPosts(posts, { 
      query: debouncedQuery, 
      tag, 
      category,
      sort 
    });
  }, [posts, debouncedQuery, tag, category, sort]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="キーワード検索"
          className="w-full md:w-64 rounded border px-3 py-2"
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="w-full md:w-48 rounded border px-3 py-2"
        >
          <option value="">すべてのタグ</option>
          {allTags.map((t) => (
            <option key={`tag-${t}`} value={t}>
              #{t}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-48 rounded border px-3 py-2"
        >
          <option value="">すべてのカテゴリ</option>
          {allCategories.map((c) => (
            <option key={`cat-${c}`} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "new" | "old")}
          className="w-full md:w-40 rounded border px-3 py-2"
        >
          <option value="new">新しい順</option>
          <option value="old">古い順</option>
        </select>
      </div>

      <ul className="space-y-2">
        {filtered.map((post) => (
          <li key={post.id} className="border rounded p-3">
            <Link href={`/blog/${post.slug}`} className="font-medium hover:underline">
              {post.title}
            </Link>
            {(post.category || post.excerpt) && (
              <div className="mt-1 flex items-center gap-2">
                {post.category && (
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {post.category}
                  </span>
                )}
                {post.excerpt && (
                  <span className="text-sm text-neutral-600 line-clamp-1">
                    {post.excerpt}
                  </span>
                )}
              </div>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-600">
                {post.tags.map((t) => (
                  <span key={t} className="rounded bg-neutral-100 px-2 py-0.5">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
        {filtered.length === 0 && <li className="text-neutral-500">条件に一致する記事がありません</li>}
      </ul>
    </div>
  );
}
