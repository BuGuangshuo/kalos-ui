import Link from "next/link";
export default function NotFound() {
  return (
    <div className="page-width catalog-heading" style={{ minHeight: "65vh" }}>
      <span className="section-eyebrow">404 · A LITTLE OFF THE PATH</span>
      <h1>Nothing here, just yet.</h1>
      <p>Let’s find a good place to start.</p>
      <Link
        className="primary-link"
        style={{ marginTop: 25 }}
        href="/components"
      >
        Explore components →
      </Link>
    </div>
  );
}
