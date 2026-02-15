import { useState } from "react";
import SEO from "../components/SEO";

function ErrorTest() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error("Test error triggered!");
  }

  return (
    <>
      <SEO
        title="Error Boundary Test"
        description="Test page for error boundary functionality"
      />

      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Error Boundary Test
          </h1>
          <p className="text-gray-600 mb-6">
            Click the button below to trigger an error and test the Error
            Boundary component.
          </p>
          <button
            onClick={() => setShouldError(true)}
            className="w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
          >
            Trigger Error
          </button>
        </div>
      </div>
    </>
  );
}

export default ErrorTest;
