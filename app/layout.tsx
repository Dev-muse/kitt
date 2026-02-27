import type { Metadata } from "next";
import { IBM_Plex_Serif, Mona_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
 

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--ibm-plex-serif",
  subsets: ["latin"],
  weight: ["500", "400", "600", "700"],
  display: "swap",
});

const monaSans = Mona_Sans({
  display: "swap",
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kittden | Your AI Voice Learning Sanctuary",
  description:
    "Upload your PDFs and have real-time voice conversations with your books. Turn your library into an interactive Knowledge Den.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${ibmPlexSerif.variable} ${monaSans.variable} font-sans relative antialiased`}
        >
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
