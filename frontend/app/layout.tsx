import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stacks DAO",
  description: "Token-governed treasury DAO on Stacks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0b0d10] text-white">{children}</body>
    </html>
  );
}
