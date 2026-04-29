import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "InstaClone",
  description: "Instagram clone",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
        <Navbar />
        <main className="max-w-xl mx-auto pt-6 px-4 pb-10">
          {children}
        </main>
      </body>
    </html>
  );
}