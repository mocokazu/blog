import { Metadata } from "next";
import CategoryManager from "@/components/admin/CategoryManager";

export const metadata: Metadata = {
  title: "カテゴリ管理",
  description: "ブログカテゴリの管理",
};

export default function CategoriesPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">カテゴリ管理</h1>
        <p className="text-slate-600 dark:text-slate-400">
          記事のカテゴリを作成、編集、削除できます
        </p>
      </div>
      
      <CategoryManager />
    </div>
  );
}
