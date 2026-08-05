import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NodeGoat – Next.js",
  description: "OWASP NodeGoat Next.js extensions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, background: "#f5f5f5" }}>
        {children}
      </body>
    </html>
  );
}
