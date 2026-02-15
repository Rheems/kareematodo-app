import { Link } from "react-router-dom";
import SEO from "../components/SEO";

function NotFound() {
  return (
    <>
      <SEO
        title="404 - Page Not Found"
        description="The page you are looking for does not exist"
      />

      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </>
  );
}

export default NotFound;
