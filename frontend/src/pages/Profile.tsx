// src/pages/Profile.tsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserSurvey } from '../services/surveyService';
import { getUserBasicInfo } from '../services/userService';
import { SurveyResponse } from './Survey';

interface ProfileData extends SurveyResponse {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePhotoURL?: string;
  graduationYear?: number;
  tags?: string[];
}

const Profile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [basicInfo, setBasicInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Load basic info (name, photo, bio)
        const userBasicInfo = await getUserBasicInfo(currentUser.uid);
        setBasicInfo(userBasicInfo);

        // Load survey data
        const survey = await getUserSurvey(currentUser.uid);
        if (survey) {
          setProfile(survey.responses);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your profile</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No profile data found. Please complete the survey first.</p>
          <button
            onClick={() => window.location.href = '/survey'}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Complete Survey
          </button>
        </div>
      </div>
    );
  }

  // Generate tags based on survey responses
  const generateTags = () => {
    const tags: string[] = [];
    if (profile.hobbies?.toLowerCase().includes('music')) tags.push('Musician');
    if (profile.hobbies?.toLowerCase().includes('gym') || profile.hobbies?.toLowerCase().includes('fitness')) tags.push('Gym');
    if (profile.noiseTolerance === 'Needs quiet' || profile.bedtime === 'Before 11 PM') tags.push('Wants Room Quiet');
    if (profile.socialFrequency === 'Rarely') tags.push('Introvert');
    if (profile.socialFrequency === '3+ nights a week') tags.push('Social');
    return tags.slice(0, 3); // Limit to 3 tags
  };

  const tags = generateTags();
  const images = ['/api/placeholder/400/400']; // Add actual image URLs from storage

  // Helper function to get user's first name from email
  const getFirstName = () => {
    return currentUser.email?.split('@')[0] || 'User';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Image Carousel */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-64 h-64 bg-gray-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  {basicInfo?.profilePhotoURL ? (
                    <img 
                      src={basicInfo.profilePhotoURL} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-lg font-semibold">No Photo</span>
                  )}
                </div>
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => (prev + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Name and Basic Info */}
            <div className="flex-grow">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {basicInfo ? `${basicInfo.firstName} ${basicInfo.lastName}` : getFirstName()}
              </h1>
              <p className="text-xl text-gray-700 mb-1">Major: {profile.major || 'Not specified'}</p>
              <p className="text-xl text-gray-700 mb-1">College: {profile.college || 'Not specified'}</p>
              <p className="text-xl text-gray-700 mb-4">Graduation Year: {basicInfo?.graduationYear || 2029}</p>
              
              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-white border-2 border-gray-300 rounded-full text-gray-700 font-medium hover:border-red-600 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Bio - could be added to survey */}
              <p className="text-gray-700 leading-relaxed">
                {profile.hobbies 
                  ? `Interested in ${profile.hobbies}. Looking for a compatible roommate!`
                  : 'Cornell student looking for a compatible roommate!'}
              </p>
            </div>
          </div>
        </div>

        {/* Lifestyle Snapshot */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Lifestyle Snapshot</h2>
          <div className="border-2 border-red-600 rounded-xl p-6 space-y-3">
            <div className="flex flex-wrap">
              <span className="font-semibold text-gray-900 w-64">Bedtime:</span>
              <span className="text-gray-700">{profile.bedtime || 'Not specified'}</span>
            </div>
            <div className="flex flex-wrap">
              <span className="font-semibold text-gray-900 w-64">Wake-up Time:</span>
              <span className="text-gray-700">{profile.wakeUpTime || 'Not specified'}</span>
            </div>
            <div className="flex flex-wrap">
              <span className="font-semibold text-gray-900 w-64">Room Tidiness:</span>
              <span className="text-gray-700">{profile.cleanliness || 'Not specified'}</span>
            </div>
            <div className="flex flex-wrap">
              <span className="font-semibold text-gray-900 w-64">Guest Policy:</span>
              <span className="text-gray-700">{profile.guests || profile.socialFrequency || 'Not specified'}</span>
            </div>
            <div className="flex flex-wrap">
              <span className="font-semibold text-gray-900 w-64">Room Loudness Preference:</span>
              <span className="text-gray-700">
                {profile.noiseTolerance === 'Needs quiet' ? 'Silent' : profile.musicPreference || 'Not specified'}
              </span>
            </div>
            <div className="flex flex-wrap">
              <span className="font-semibold text-gray-900 w-64">Study Habits:</span>
              <span className="text-gray-700">{profile.studyLocation || 'Not specified'}</span>
            </div>
          </div>
        </div>

        {/* Non-Negotiables and Preferences */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Non-Negotiables */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Non-Negotiables</h2>
            <div className="border-2 border-red-600 rounded-xl p-6 space-y-2">
              {profile.noiseTolerance && (
                <p className="text-gray-700">• {profile.noiseTolerance}</p>
              )}
              {profile.guests && (
                <p className="text-gray-700">• Guest policy: {profile.guests}</p>
              )}
              {profile.cleanliness && (
                <p className="text-gray-700">• {profile.cleanliness}</p>
              )}
              {profile.musicPreference && (
                <p className="text-gray-700">• {profile.musicPreference}</p>
              )}
              {(!profile.noiseTolerance && !profile.guests && !profile.cleanliness && !profile.musicPreference) && (
                <p className="text-gray-500 italic">No non-negotiables specified</p>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Preferences</h2>
            <div className="border-2 border-red-600 rounded-xl p-6 space-y-2">
              {profile.desiredDorms && profile.desiredDorms.length > 0 && (
                <p className="text-gray-700">• Prefers {profile.desiredDorms.join(', ')}</p>
              )}
              {profile.roomType && (
                <p className="text-gray-700">• Prefers {profile.roomType}</p>
              )}
              {profile.acRequirement && (
                <p className="text-gray-700">• {profile.acRequirement}</p>
              )}
              {profile.personalityType && (
                <p className="text-gray-700">• {profile.personalityType}</p>
              )}
              {profile.studyLocation && (
                <p className="text-gray-700">• Studies at {profile.studyLocation}</p>
              )}
              {(!profile.desiredDorms && !profile.roomType && !profile.acRequirement && !profile.personalityType && !profile.studyLocation) && (
                <p className="text-gray-500 italic">No preferences specified</p>
              )}
            </div>
          </div>
        </div>

        {/* Get to Know Me */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Get to Know Me</h2>
          <div className="border-2 border-red-600 rounded-xl p-6 space-y-4">
            <div>
              <span className="font-semibold text-gray-900">Favorite Cornell study spot:</span>
              <p className="text-gray-700 mt-1">{profile.favoriteStudySpot || 'Not specified'}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Ideal Friday night:</span>
              <p className="text-gray-700 mt-1">{profile.fridayNight || 'Not specified'}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Pet peeve:</span>
              <p className="text-gray-700 mt-1">{profile.petPeeves || 'Not specified'}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Something I love:</span>
              <p className="text-gray-700 mt-1">{profile.hobbies || 'Not specified'}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Open-ended icebreaker:</span>
              <p className="text-gray-700 mt-1">{profile.redFlags ? `Things to avoid: ${profile.redFlags}` : 'Ask me anything!'}</p>
            </div>
          </div>
        </div>

        {/* Contact Button */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Contact Information</h2>
          <div className="space-y-4">
            {basicInfo?.email && (
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900 w-32">Email:</span>
                <a href={`mailto:${basicInfo.email}`} className="text-red-600 hover:text-red-700 hover:underline">
                  {basicInfo.email}
                </a>
              </div>
            )}
            {basicInfo?.phone && (
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900 w-32">Phone:</span>
                <a href={`tel:${basicInfo.phone}`} className="text-red-600 hover:text-red-700 hover:underline">
                  {basicInfo.phone}
                </a>
              </div>
            )}
            {basicInfo?.instagram && (
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900 w-32">Instagram:</span>
                <a 
                  href={`https://instagram.com/${basicInfo.instagram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-700 hover:underline"
                >
                  @{basicInfo.instagram}
                </a>
              </div>
            )}
            {(!basicInfo?.email && !basicInfo?.phone && !basicInfo?.instagram) && (
              <p className="text-gray-500 text-center">No contact information provided</p>
            )}
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => window.location.href = '/survey'}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-colors shadow-lg"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;