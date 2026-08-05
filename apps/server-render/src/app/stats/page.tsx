import Link from "next/link";

type Stats = {
  userCount: number;
  contributionCount: number;
  memoCount: number;
};

async function fetchStats(): Promise<Stats | null> {
  try {
    const port = process.env.PORT || 4000;
    const res = await fetch(`http://localhost:${port}/api/stats`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function StatsPage() {
  const stats = await fetchStats();

  return (
    <main style={{ maxWidth: 600, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>App Stats</h1>
      {stats === null ? (
        <p>Stats unavailable – make sure the server is connected to MongoDB.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {[
              ["Users", stats.userCount],
              ["Contributions", stats.contributionCount],
              ["Memos", stats.memoCount],
            ].map(([label, count]) => (
              <tr key={String(label)} style={{ borderTop: "1px solid #ddd" }}>
                <td style={{ padding: "0.6rem 1rem", fontWeight: 500 }}>{label}</td>
                <td style={{ padding: "0.6rem 1rem" }}>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p style={{ marginTop: "2rem" }}>
        <Link href="/security-dashboard" style={{ color: "#0070f3" }}>← Security Dashboard</Link>
      </p>
    </main>
  );
}
