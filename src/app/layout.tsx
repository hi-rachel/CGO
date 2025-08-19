import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "CGO - Core • Growth • Optional",
  description:
    "Organize your tasks into Core, Growth, and Optional categories with AI-powered prioritization",
  keywords: "productivity, task management, prioritization, AI, focus",
  authors: [{ name: "CGO Team" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className="antialiased bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full opacity-20 dark:opacity-10 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-100 to-pink-200 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full opacity-20 dark:opacity-10 blur-3xl"></div>
          </div>

          {/* Main content */}
          <div className="relative z-10">{children}</div>
        </div>
      </body>
      <GoogleAnalytics gaId="G-5C8YKLN20R" />
    </html>
  );
}
