import "./globals.css";

export const metadata = {
  title: "Mr Hyre",
  description: "AI Hiring Platform",
};

import { ThemeProvider } from "../components/ThemeProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}