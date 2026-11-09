import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Navbar from "./components/Navbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

import Provider from "./provider";
import { AppSidebar } from "./components/Appsidebar";
import { ColorThemeProvider } from "./context/ColorThemeContext";
import { RainBackground } from "./components/RainBackground";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dream Reader — AI dream interpreter",
  description:
    "Interpret your dreams in the context of your own life, with AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ConvexClientProvider>
              <Provider>
                {/* Must wrap the rain, navbar, sidebar and every page. */}
                <ColorThemeProvider>
                  {/* Fixed full-screen rain behind the whole app. */}
                  <RainBackground fixed />

                  <SidebarProvider>
                    {/* relative z-10 keeps all content above the rain */}
                    <div className="relative z-10 flex min-h-screen w-full flex-col">
                      <Navbar />
                      <div className="flex flex-1 overflow-hidden">
                        <AppSidebar />
                        {/* bg-transparent lets the rain show through */}
                        <SidebarInset className="flex-1 overflow-auto bg-transparent">
                          <main className="p-4 lg:p-6">{children}</main>
                        </SidebarInset>
                      </div>
                    </div>
                  </SidebarProvider>
                </ColorThemeProvider>

                <Toaster richColors />
              </Provider>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
