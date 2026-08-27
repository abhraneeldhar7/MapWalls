import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Artografer",
  description: "We allow users to explore and customize maps with various styles and features. It provides an interactive map interface where users can search for places, view different map layers, and personalize their map experience.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="font-sans antialiased"
    >
      <body>
        {children}
      </body>
    </html>
  );
}
