
import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: "ratimics::legion",
    description: "Crowley's demons communication nexus",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${GeistMono.className} min-h-screen bg-background antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                    <main className="flex-1">{children}</main>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
