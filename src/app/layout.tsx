import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import { NavBar } from '../components/NavBar';
import { AuthDebug } from '../components/AuthDebug';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            <NavBar />
            {children}
            <AuthDebug />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
