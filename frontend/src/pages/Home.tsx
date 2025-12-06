import { Shield, Heart, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import ProfileCard from "../components/ProfileCard";
import { getAllUsersBasicInfo } from "../services/surveyService";
import "./index.css";

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  major: string;
  graduationYear: number;
  profilePhotoURL?: string;
}

const HomePage = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const users = await getAllUsersBasicInfo();
        setProfiles(users);
      } catch (error) {
        console.error("Error loading profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section
        id="home"
        className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent">
                Cornell Roommate
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Connect with compatible students who share your lifestyle,
              interests, and academic goals. Making housing decisions easier,
              one match at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "/signup")}
                className="bg-gradient-to-r from-red-700 to-red-800 text-white px-8 py-4 rounded-xl hover:from-red-800 hover:to-red-900 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                Start Matching
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-red-700 hover:text-red-700 transition-all font-semibold text-lg bg-white">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-red-700 mb-2">
                {profiles.length}+
              </div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-700 mb-2">1,200+</div>
              <div className="text-gray-600">Successful Matches</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-700 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Matches Section */}
      <section id="matches" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Browse Profiles
            </h2>
            <p className="text-lg text-gray-600">
              Students looking for roommates at Cornell
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : profiles.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {profiles.map((profile) => (
                <div key={profile.userId} className="flex-shrink-0 w-80">
                  <ProfileCard
                    name={`${profile.firstName} ${profile.lastName}`}
                    major={profile.major}
                    graduationYear={profile.graduationYear}
                    userId={profile.userId}
                    photoURL={profile.profilePhotoURL}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                No profiles available yet. Be the first to create one!
              </p>
              <button
                onClick={() => (window.location.href = "/survey")}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Complete Survey
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600">
              The smart way to find your ideal living situation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-red-100 rounded-xl mb-6 flex items-center justify-center">
                <Shield className="text-red-700" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                Verified Profiles
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All users are verified Cornell students. Your safety and
                security are our top priorities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-red-100 rounded-xl mb-6 flex items-center justify-center">
                <Heart className="text-red-700" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                Smart Matching
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our algorithm considers your lifestyle, schedule, and
                preferences to find the perfect match.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-red-100 rounded-xl mb-6 flex items-center justify-center">
                <MessageCircle className="text-red-700" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                Easy Communication
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Connect instantly with potential roommates through our built-in
                messaging system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Three simple steps to finding your perfect roommate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-red-200 via-red-300 to-red-200"></div>

            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-red-700 to-red-900 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg relative z-10">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Create Your Profile
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Share your interests, major, lifestyle preferences, and what
                you're looking for in a roommate.
              </p>
            </div>

            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-red-700 to-red-900 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg relative z-10">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Get Matched
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our intelligent algorithm finds compatible roommates based on
                your unique preferences and habits.
              </p>
            </div>

            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-red-700 to-red-900 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg relative z-10">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Connect & Move In
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Chat with your matches, meet up, and find the perfect person to
                share your Cornell experience with.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-700 to-red-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            Ready to Find Your Perfect Roommate?
          </h2>
          <p className="text-xl text-red-100 mb-10 leading-relaxed">
            Join thousands of Cornell students who've found their ideal living
            situation through our platform.
          </p>
          <button
            onClick={() => (window.location.href = "/survey")}
            className="bg-white text-red-700 px-10 py-4 rounded-xl hover:bg-gray-50 transition-all text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105"
          >
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;