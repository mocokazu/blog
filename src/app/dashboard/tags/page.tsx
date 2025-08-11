import { Metadata } from "next";
import TagManager from "@/components/admin/TagManager";

export const metadata: Metadata = {
  title: "タグ管理",
  description: "ブログタグの管理",
};

export default function TagsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">タグ管理</h1>
        <p className="text-slate-600 dark:text-slate-400">
          記事のタグを作成、編集、削除できます
        </p>
      </div>
      
      <TagManager />
    </div>
  );
}
