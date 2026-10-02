import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: [
    "400",
    "500",
    "600",
    "700",
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "University HR Management System",
  description:
    "University Lecturer Human Resources Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
       data-scroll-behavior="smooth"
      className={poppins.variable}
    >
      <body
      suppressHydrationWarning={true}
       className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}