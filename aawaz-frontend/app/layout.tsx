import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Awaaz",
  description: "A calm civic complaint platform for tourists and authorities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}
