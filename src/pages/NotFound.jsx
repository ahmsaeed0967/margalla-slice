import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle.js";

export default function NotFound() {
  usePageTitle("Page not found");
  return (
    <div className="page">
      <h1>Page not found</h1>
      <p>That address does not exist on this site.</p>
      <div className="button-row">
        <Link className="btn btn--primary" to="/menu">
          Go to the menu
        </Link>
        <Link className="btn btn--secondary" to="/">
          Back to home
        </Link>
      </div>
    </div>
  );
}
