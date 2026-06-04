import type { Metadata } from "next";
import {
    Geist,
    Geist_Mono,
    JetBrains_Mono,
} from "next/font/google";

import "./globals.css";

import { cn } from "@/lib/utils";
import { Navbar } from "../components/common/Navbar";
import { Toaster } from "react-hot-toast";
// import { usePathname } from "next/navigation";

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "GitNest",
    description: "Modern GitNest built with Next.js",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    // const pathname = usePathname()
    // const publicUrl = ['/login', '/signup'].includes(pathname)

    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn(
                "h-full",
                "dark",
                geistSans.variable,
                geistMono.variable,
                jetbrainsMono.variable,
            )}
        >

             <body
                className={cn(
                    "min-h-screen",
                    "text-zinc-100",
                    "font-mono",
                    "antialiased",
                    "overflow-x-hidden"
                )}
            >
               <Navbar />
               <Toaster
                   position="top-right"
                   reverseOrder={false}
                   gutter={8}
                   toastOptions={{
                       duration: 4000,
                       style: {
                           background: "#09090b", // zinc-950
                           color: "#fafafa", // zinc-50
                           border: "1px solid rgba(255,255,255,0.1)",
                           fontSize: "14px",
                           borderRadius: "12px",
                           padding: "12px 20px",
                           boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                           backdropFilter: "blur(10px)",
                       },
                       success: {
                           iconTheme: {
                               primary: "#10b981", // emerald-500
                               secondary: "#fff",
                           },
                       },
                       error: {
                           iconTheme: {
                               primary: "#ef4444", // red-500
                               secondary: "#fff",
                           },
                       },
                   }}
               />
                <main className="relative bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_80%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.08),_transparent_40%)] flex min-h-screen flex-col">
                    {children}
                </main>

            </body>

        </html>
    );
}