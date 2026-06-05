import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KARE Orthopaedics — Dr. Ajay N | Robotic Joint Replacement & Spine Surgeon, Bengaluru",
  description: "Dr. Ajay N is a leading orthopaedic and joint replacement surgeon at KARE Orthopaedics, Bengaluru, specializing in robotic joint replacement, spine treatments, fracture care, and sports injury recovery. Bringing Mobility to Life.",
  keywords: ["KARE Orthopaedics", "Dr. Ajay N", "orthopaedic surgeon Bengaluru", "robotic joint replacement Bengaluru", "spine surgery Bengaluru", "fracture care Bengaluru", "sports injury clinic Bengaluru"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
