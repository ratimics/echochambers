
import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { MainNav } from "@/components/nav/main-nav";

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
                    <div className="flex min-h-screen flex-col">
                        <MainNav />
                        <div className="flex flex-1">
                            {children}
                        </div>
                    </div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
