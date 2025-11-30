import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import { ThemeProvider } from "../context/ThemeContext";
import MuiThemeProvider from "../components/ThemeRegistry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cantara Finance",
  description:
    "Cantara is a hybrid lending and borrowing protocol built on Canton Network. ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <MuiThemeProvider>
            <AppProviders>{children}</AppProviders>
          </MuiThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
