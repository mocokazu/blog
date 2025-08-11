
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AppThemeProvider from "@/components/theme/ThemeProvider";
import SiteHeader from "@/components/layout/SiteHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "AI Tech Blog - LogicEdge",
    template: "%s | LogicEdge"
  },
  description: "最小の労力で、最大のインパクトを。AIを活用したテックブログとポートフォリオサイト",
  keywords: ["AI", "技術ブログ", "プログラミング", "Web開発", "バイブコーディング", "LogicEdge"],
  authors: [{ name: "LogicEdge", url: "https://logicedge.dev" }],
  creator: "LogicEdge",
  publisher: "LogicEdge",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: "LogicEdge",
    title: "AI Tech Blog - LogicEdge",
    description: "最小の労力で、最大のインパクトを。AIを活用したテックブログとポートフォリオサイト",
    images: [
      {
        url: "/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "LogicEdge - AI Tech Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tech Blog - LogicEdge",
    description: "最小の労力で、最大のインパクトを。AIを活用したテックブログとポートフォリオサイト",
    images: ["/og/og-default.png"],
    creator: "@logicedge",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5" },
    ],
  },
  manifest: "/site.webmanifest",
  viewport: { width: "device-width", initialScale: 1, maximumScale: 5 },
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }, { media: "(prefers-color-scheme: dark)", color: "#1e293b" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50`}>
        <AuthProvider>
          <AppThemeProvider>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
            </div>
          </AppThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
