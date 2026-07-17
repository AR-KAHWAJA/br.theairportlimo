import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>The WordPress route you are looking for is not part of this MERN rebuild.</p>
      <Link className="button primary" to="/">
        Back to home
      </Link>
    </section>
  );
}
