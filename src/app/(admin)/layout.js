import { SideBar } from "@/components/shared";
import "../globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/providers";
import { Navbar } from "@/components/common/Layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`relative ${inter.className}`}>
        <Providers>
          <main className="flex">
            <SideBar />
            <div className="flex-1">
              <Navbar />
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
