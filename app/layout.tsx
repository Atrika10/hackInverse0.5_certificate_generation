import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "HackInverse Certificate Portal",
  description: "Find and download your HackInverse hackathon participation certificate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body
        style={{
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#008080",
          color: "#000",
          fontFamily: "'Tahoma', 'MS Sans Serif', Arial, sans-serif",
          fontSize: "11px",
          margin: 0,
          padding: 0,
        }}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
