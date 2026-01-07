import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Simple Notes App",
  description: "Created with Next.js and MongoDB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Adding bg-gray-50 here ensures the whole screen 
          is a light gray, making your white note cards pop. 
      */}
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}