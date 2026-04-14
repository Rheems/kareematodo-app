import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Navbar from "./components/Navbar.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import Home from "./pages/Home.jsx";
import TodoDetail from "./pages/TodoDetail.js";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";
import ErrorTest from "./pages/ErrorTest.jsx";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />

          <main className="flex-1">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/error-test" element={<ErrorTest />} />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/todos/:id"
                  element={
                    <ProtectedRoute>
                      <TodoDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>

          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
              <p>
                &copy; {new Date().getFullYear()} Todo App. Built with React.
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
