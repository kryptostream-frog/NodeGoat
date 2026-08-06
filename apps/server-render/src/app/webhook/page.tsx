import Link from "next/link";

type DepGraph = {
  direct: { axios: string | null };
  transitive: { "follow-redirects": string | null };
  reachableCves: string[];
};

async function fetchGraph(): Promise<DepGraph | null> {
  try {
    const port = process.env.PORT || 4000;
    const res = await fetch(`http://localhost:${port}/api/webhook/graph`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function WebhookPage() {
  const graph = await fetchGraph();

  return (
    <main style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Webhook Preview – Transitive CVE Reachability</h1>
      <p>
        This module demonstrates a <strong>transitive</strong> CVE reachable
        from first-party code. The <code>/api/webhook/preview?url=...</code>
        endpoint calls <code>axios</code> (a direct dependency) which
        internally delegates redirects to <code>follow-redirects</code> (a
        transitive dependency).
      </p>

      <h2>Reachability chain</h2>
      <pre style={{ background: "#eee", padding: "1rem", borderRadius: 4 }}>
{`user input (req.query.url)
  → app/routes/webhook.js  [first-party]
    → axios.create().get(url)  [direct dep]
      → follow-redirects  [TRANSITIVE dep]
        ← CVE-2024-28849  Authorization header leaked on cross-host redirect`}
      </pre>

      <h2>Resolved dependency versions</h2>
      {graph === null ? (
        <p>Dependency graph unavailable – is the Express backend connected?</p>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
            <tbody>
              <tr style={{ borderTop: "1px solid #ddd" }}>
                <td style={{ padding: "0.6rem 1rem", fontWeight: 500 }}>axios (direct)</td>
                <td style={{ padding: "0.6rem 1rem" }}>{graph.direct.axios ?? "not installed"}</td>
              </tr>
              <tr style={{ borderTop: "1px solid #ddd" }}>
                <td style={{ padding: "0.6rem 1rem", fontWeight: 500 }}>follow-redirects (transitive)</td>
                <td style={{ padding: "0.6rem 1rem" }}>{graph.transitive["follow-redirects"] ?? "not installed"}</td>
              </tr>
            </tbody>
          </table>
          <h3>Reachable CVEs on this call graph</h3>
          <ul>
            {graph.reachableCves.map((c) => <li key={c}><code>{c}</code></li>)}
          </ul>
        </>
      )}

      <h2>Try it</h2>
      <p>
        <code>GET /api/webhook/preview?url=https://httpbin.org/redirect-to?url=https://example.com</code>
      </p>
      <p>
        <Link href="/security-dashboard" style={{ color: "#0070f3" }}>← Security Dashboard</Link>
      </p>
    </main>
  );
}
