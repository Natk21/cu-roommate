import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link for navigation

const RootLayout = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-700 to-red-900 rounded-lg"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent">
              Cornell Roommate Finder
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-red-700 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/survey"
              className="text-gray-700 hover:text-red-700 transition-colors font-medium"
            >
              Survey
            </Link>
            <Link
              to="#matches"
              className="text-gray-700 hover:text-red-700 transition-colors font-medium"
            >
              Matches
            </Link>
            <Link
              to="#about"
              className="text-gray-700 hover:text-red-700 transition-colors font-medium"
            >
              About
            </Link>
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
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-red-700 to-red-900 rounded-lg"></div>
              <span className="font-bold text-lg">Cornell Roommate Finder</span>
            </div>
            <p className="text-gray-400 text-sm">
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

export default RootLayout;
