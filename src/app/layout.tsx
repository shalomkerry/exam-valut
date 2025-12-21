import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  weight: ["300", "400", "500", "600", "700"],
});


export const metadata: Metadata = {
  title: "ExamVault",
  description: "Access previous exams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${lexend.className}  antialiased `}
      >
        <Toaster position="top-right" richColors/>
        {children}
      </body>
    </html>
  );
}
