import type { Metadata } from "next";
import Script from "next/script";
import { LocaleProvider } from "@/components/LocaleProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://realjoin.local"),
  title: {
    default: "REALJOIN",
    template: "%s | REALJOIN",
  },
  description: "REALJOIN official site for real user participation services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className="dark h-full antialiased"
    >
      <body className="min-h-full font-sans text-foreground">
        <Script id="avola-theme-init" strategy="beforeInteractive">
          {`(() => {
            const key = "avola-theme";
            const root = document.documentElement;
            let theme = "dark";

            try {
              const storedTheme = window.localStorage.getItem(key);
              theme = storedTheme === "light" ? "light" : "dark";
            } catch {}

            root.classList.remove("dark", "light");
            root.classList.add(theme);
            root.style.colorScheme = theme;
          })();`}
        </Script>
        <Script id="avola-locale-init" strategy="beforeInteractive">
          {`(() => {
            const key = "avola-locale";
            const root = document.documentElement;
            let locale = "zh-CN";

            try {
              const storedLocale = window.localStorage.getItem(key);
              locale = storedLocale === "en" ? "en" : "zh-CN";
            } catch {}

            root.lang = locale;
          })();`}
        </Script>
        <ThemeProvider>
          <LocaleProvider>
            <div className="relative flex min-h-screen flex-col">{children}</div>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
