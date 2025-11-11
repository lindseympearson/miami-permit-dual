import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Miami Permit Wizard",
  description: "AI permit filler for Miami-Dade County & City of Miami",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
