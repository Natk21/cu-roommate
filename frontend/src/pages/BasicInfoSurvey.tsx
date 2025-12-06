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
  email?: string;
  phone?: string;
  instagram?: string;
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
    email: "",
    phone: "",
    instagram: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const checkBasicInfo = async () => {
      if (currentUser) {
        setIsLoading(true);
        try {
          const basicInfo = await getUserBasicInfo(currentUser.uid);
          if (basicInfo) {
            // Auto-fill the form with existing user data
            setFormData((prev) => ({
              ...prev,
              ...basicInfo,
              // Ensure graduationYear is a number
              graduationYear:
                typeof basicInfo.graduationYear === "number"
                  ? basicInfo.graduationYear
                  : 2029, // Default value if not provided
            }));

            // Set photo preview if profile photo exists
            if (basicInfo.profilePhotoURL) {
              setPhotoPreview(basicInfo.profilePhotoURL);
            }
          } else {
            // User hasn't completed basic info, do nothing
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "graduationYear" ? parseInt(value) : value,
    }));
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Resize to max 300x300 while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          const maxSize = 300;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to base64 with heavy compression
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);

          console.log("Original size:", file.size, "bytes");
          console.log(
            "Compressed size:",
            compressedBase64.length,
            "characters"
          );

          // Check if still too large (aiming for under 200KB in base64)
          if (compressedBase64.length > 200000) {
            reject(
              new Error(
                "Image is still too large after compression. Please use a smaller image."
              )
            );
          } else {
            resolve(compressedBase64);
          }
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB original)
      if (file.size > 5 * 1024 * 1024) {
        setError("Photo must be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      try {
        setError(null);
        const compressedBase64 = await compressImage(file);

        setPhotoPreview(compressedBase64);
        setFormData((prev) => ({
          ...prev,
          profilePhotoURL: compressedBase64,
        }));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to process image");
        }
      }
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
      console.log("Attempting to submit with user:", currentUser.uid);
      console.log("Form data:", formData);

      const result = await submitBasicInfo(currentUser.uid, formData);
      console.log("Submit result:", result);

      // Redirect to main survey
      navigate("/survey");
      scrollToTop();
    } catch (error) {
      console.error("Error submitting basic info:", error);

      // Show detailed error message
      if (error instanceof Error) {
        setError(`Failed to submit: ${error.message}`);
      } else {
        setError("Failed to submit. Please try again.");
      }
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
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Profile Photo */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Profile Photo (Optional)
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Add a photo to help others recognize you. Images will be
              automatically compressed.
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

              <div className="flex gap-2">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors">
                  <span>{photoPreview ? "Change Photo" : "Choose Photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      setFormData((prev) => ({ ...prev, profilePhotoURL: "" }));
                    }}
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Will be resized to 300x300 and compressed
              </p>
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
                placeholder="First Name"
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
                placeholder="Last Name"
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
          <div className="mb-6">
            <label
              htmlFor="bio"
              className="block text-lg font-semibold text-gray-900 mb-2"
            >
              Bio <span className="text-red-600">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Tell potential roommates about yourself! Share your interests,
              hobbies, what you're studying, and what you're looking for in a
              roommate.
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
              <p
                className={`text-sm ${formData.bio.length >= 50 ? "text-green-600" : "text-gray-500"}`}
              >
                {formData.bio.length} / 50
              </p>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="mb-6 border-t pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Contact Information
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              How can potential roommates reach you? (All optional)
            </p>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-md font-medium text-gray-900 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="your.email@cornell.edu"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-md font-medium text-gray-900 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="(123) 456-7890"
                />
              </div>

              {/* Instagram */}
              <div>
                <label
                  htmlFor="instagram"
                  className="block text-md font-medium text-gray-900 mb-2"
                >
                  Instagram Username
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="username"
                  />
                </div>
              </div>
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
                "Save & Continue →"
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Your information will be visible to other Cornell students looking for
          roommates
        </p>
      </div>
    </div>
  );
};

export default BasicInfoSurvey;
