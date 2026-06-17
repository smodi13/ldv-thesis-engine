import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LDV Thesis Engine",
  description: "Sourcing and evaluating the next generation of category-defining startups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
