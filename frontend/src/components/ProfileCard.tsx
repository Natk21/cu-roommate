// src/components/ProfileCard.tsx
// This is for the vertical cards (like on homepage)

import ProfileImage from "./ProfileImage";
import { useState, useEffect } from "react";

type ProfileCardProps = {
  name: string;
  major: string;
  graduationYear: number;
  userId?: string; // User ID for navigation
  onClick?: () => void; // Make it clickable
  matchScore?: number; // Optional match score badge
  photoURL?: string; // Profile photo URL
};



function ProfileCard({
  name,
  major,
  graduationYear,
  userId,
  onClick,
  matchScore,
  photoURL,
}: ProfileCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (userId) {
      // Default behavior: navigate to profile
      window.location.href = `/profile/${userId}`;
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all cursor-pointer hover:shadow-xl hover:scale-105"
    >
      {/* Profile Image */}
      <ProfileImage 
          name={name}
          photoURL={photoURL}
          matchScore={matchScore}
          size="large"
          rounded={false}
      />

      {/* Profile Info */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 text-gray-900">{name}</h3>
        <p className="text-gray-700 mb-1">Major: {major}</p>
        <p className="text-gray-700">Graduation Year: {graduationYear}</p>
      </div>
    </div>
  );
}

export default ProfileCard;