import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const RootLayout = () => {
  const { currentUser, loading, signOutUser } = useAuth();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img
                src={"/public/logo.svg"}
                alt="CURoommate Logo"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <Link
                onClick={() => scrollToTop()}
                to="/"
                className="text-xl font-bold bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent"
              >
                CURoommate
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {currentUser && (
                <Link
                  onClick={() => scrollToTop()}
                  to="/matches"
                  className="text-gray-700 hover:text-red-700 transition-colors font-medium"
                >
                  Matches
                </Link>
              )}
              {currentUser ? (
                // Show Profile and Sign Out when logged in
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-red-700 transition-colors font-medium"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        await signOutUser();
                        window.location.href = "/";
                      } catch (error) {
                        console.error("Error during sign out:", error);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                // Show sign in button when logged out
                <Link
                  to="/login"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Outlet /> {/* This renders the matched child route */}
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2">
                <img
                  src={"/public/logo.svg"}
                  alt="CURoommate Logo"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <Link
                  to="/"
                  className="text-xl font-bold bg-red-7
                  00 bg-clip-text text-transparent"
                >
                  CURoommate
                </Link>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Connecting Cornell students for better living experiences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Safety
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Cornell Roommate Finder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
