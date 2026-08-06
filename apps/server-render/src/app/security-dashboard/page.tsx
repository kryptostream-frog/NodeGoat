import Link from "next/link";

const VULNERABILITIES = [
  { id: "a1", label: "A1 – Injection",                           route: "/contributions" },
  { id: "a2", label: "A2 – Broken Authentication",               route: "/login" },
  { id: "a3", label: "A3 – Cross-Site Scripting (XSS)",          route: "/memos" },
  { id: "a4", label: "A4 – Insecure Direct Object Reference",    route: "/allocations/1" },
  { id: "a5", label: "A5 – Security Misconfiguration",           route: "/tutorial/a5" },
  { id: "a6", label: "A6 – Sensitive Data Exposure",             route: "/tutorial/a6" },
  { id: "a7", label: "A7 – Missing Function Level Access Control", route: "/benefits" },
  { id: "a8", label: "A8 – Cross-Site Request Forgery (CSRF)",   route: "/tutorial/a8" },
  { id: "a9", label: "A9 – Using Components with Known Vulnerabilities", route: "/tutorial/a9" },
  { id: "a10", label: "A10 – Server-Side Request Forgery (SSRF)", route: "/research" },
  { id: "transitive", label: "Bonus – Transitive CVE Reachability (axios / follow-redirects)", route: "/webhook" },
] as const;

export default function SecurityDashboardPage() {
  return (
    <main style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Security Dashboard</h1>
      <p>OWASP Top 10 training modules covered by NodeGoat.</p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#e8e8e8" }}>
            <th style={{ padding: "0.6rem 1rem", textAlign: "left" }}>Vulnerability</th>
            <th style={{ padding: "0.6rem 1rem", textAlign: "left" }}>Training Module</th>
          </tr>
        </thead>
        <tbody>
          {VULNERABILITIES.map((v) => (
            <tr key={v.id} style={{ borderTop: "1px solid #ddd" }}>
              <td style={{ padding: "0.6rem 1rem" }}>{v.label}</td>
              <td style={{ padding: "0.6rem 1rem" }}>
                <Link href={v.route} style={{ color: "#0070f3" }}>View module →</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: "2rem" }}>
        <Link href="/dashboard" style={{ color: "#0070f3" }}>← Back to Dashboard</Link>
        {" · "}
        <Link href="/stats" style={{ color: "#0070f3" }}>App Stats</Link>
      </p>
    </main>
  );
}
