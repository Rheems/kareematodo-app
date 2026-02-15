import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <SEO title="Profile" description="View and manage your profile" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">My Profile</h1>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {user?.name}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">User ID:</span>
                <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                  {user?.id || "N/A"}
                </span>
              </div>

              {user?.createdAt && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">
                    Member since:
                  </span>
                  <span className="text-gray-800">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
