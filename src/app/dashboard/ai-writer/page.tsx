"use client";

import dynamic from "next/dynamic";

const AIGeneratorForm = dynamic(() => import("@/components/ai/AIGeneratorForm"), { ssr: false });

export default function AIWriterPage() {
  return (
    <main className="p-4">
      <AIGeneratorForm />
    </main>
  );
}
