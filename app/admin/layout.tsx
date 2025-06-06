import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";
import "../globals.css";
import { ReduxProvider } from "@/Redux/core/provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ActiveProjectProvider } from "@/components/Admin/AdminDashboard/Workspace/ActiveProjectContexts/ActiveProjectContext";

// Font configurations
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for admin section
export const metadata: Metadata = {
  title: {
    template: "%s | Admin Portal",
    default: "Admin Portal - Secure Administration Dashboard",
  },
  description: "Secure administrative access to manage users, analytics, and system configurations.",
  keywords: ["admin", "dashboard", "secure", "management", "portal"],
  authors: [{ name: "Your Company" }],
  creator: "Your Company",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/admin",
    title: "Admin Portal - Secure Administration",
    description: "Secure administrative access with enterprise-grade security",
    siteName: "Your Company Admin Portal",
  },
  twitter: {
    card: "summary",
    title: "Admin Portal",
    description: "Secure administrative access",
  },
  other: {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  },
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="admin-theme"
        >
          <div
            className={`
          ${inter.variable} font-sans antialiased 
          min-h-screen 
          bg-slate-50 dark:bg-slate-900 
          text-slate-900 dark:text-slate-50 
          selection:bg-indigo-500/20
          relative flex flex-col
        `}
          >
            <ReduxProvider>
              <TooltipProvider>
                <ActiveProjectProvider
                  autoExpireHours={24}
                  enablePersistence={true}
                  enableNotifications={true}
                >
                  {children}
                </ActiveProjectProvider>
                <Toaster />
              </TooltipProvider>
            </ReduxProvider >
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
