//survey capturing basic user information

// src/pages/BasicInfoSurvey.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getUserBasicInfo, submitBasicInfo } from "../services/userService";

export interface BasicUserInfo {
  firstName: string;
  lastName: string;
  graduationYear: number;
  bio: string;
  profilePhotoURL?: string;
}

const BasicInfoSurvey = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<BasicUserInfo>({
    firstName: "",
    lastName: "",
    graduationYear: 2029,
    bio: "",
    profilePhotoURL: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBasicInfo = async () => {
      if (currentUser) {
        setIsLoading(true);
        try {
          const basicInfo = await getUserBasicInfo(currentUser.uid);
          if (basicInfo) {
            // User already completed basic info, redirect to main survey
            navigate("/survey");
          }
        } catch (error) {
          console.error("Error checking basic info:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkBasicInfo();
  }, [currentUser, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "graduationYear" ? parseInt(value) : value,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Photo must be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setFormData((prev) => ({
          ...prev,
          profilePhotoURL: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError("You must be logged in to submit");
      return;
    }

    // Validation
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return;
    }

    if (!formData.bio.trim()) {
      setError("Bio is required");
      return;
    }

    if (formData.bio.length < 50) {
      setError("Bio must be at least 50 characters");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitBasicInfo(currentUser.uid, formData);
      // Redirect to main survey
      navigate("/survey");
    } catch (error) {
      console.error("Error submitting basic info:", error);
      setError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to continue</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to CURoommate! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Let's start by getting to know you a bit better
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
              1
            </div>
            <div className="w-16 h-1 bg-red-600"></div>
            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">
              2
            </div>
            <p className="ml-2 text-sm text-gray-600">Step 1 of 2</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          {/* Profile Photo */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Profile Photo (Optional)
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Add a photo to help others recognize you
            </p>
            
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Photo</span>
                )}
              </div>
              
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors">
                <span>Choose Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">Max size: 5MB</p>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-lg font-semibold text-gray-900 mb-2"
              >
                First Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Max"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-lg font-semibold text-gray-900 mb-2"
              >
                Last Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Shi"
              />
            </div>
          </div>

          {/* Graduation Year */}
          <div className="mb-6">
            <label
              htmlFor="graduationYear"
              className="block text-lg font-semibold text-gray-900 mb-2"
            >
              Expected Graduation Year <span className="text-red-600">*</span>
            </label>
            <select
              id="graduationYear"
              name="graduationYear"
              required
              value={formData.graduationYear}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
              <option value={2028}>2028</option>
              <option value={2029}>2029</option>
              <option value={2030}>2030</option>
              <option value={2031}>2031</option>
              <option value={2032}>2032</option>
            </select>
          </div>

          {/* Bio */}
          <div className="mb-8">
            <label
              htmlFor="bio"
              className="block text-lg font-semibold text-gray-900 mb-2"
            >
              Bio <span className="text-red-600">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Tell potential roommates about yourself! Share your interests, hobbies, 
              what you're studying, and what you're looking for in a roommate.
            </p>
            <textarea
              id="bio"
              name="bio"
              required
              value={formData.bio}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
              placeholder="Hi! I'm a Computer Science major who loves coffee, hiking, and late-night study sessions. I'm looking for a roommate who's respectful, clean, and down to hang out sometimes but also respects quiet time..."
            />
            <div className="flex justify-between mt-2">
              <p className="text-sm text-gray-500">Minimum 50 characters</p>
              <p className={`text-sm ${formData.bio.length >= 50 ? 'text-green-600' : 'text-gray-500'}`}>
                {formData.bio.length} / 50
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                "Continue to Survey →"
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Your information will be visible to other Cornell students looking for roommates
        </p>
      </div>
    </div>
  );
};

export default BasicInfoSurvey;