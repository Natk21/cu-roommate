type ProfileImageProps = {
  name: string
  matchScore?: number;
  photoURL?: string;
  size?: 'small' | 'medium' | 'large'; // NEW!
  rounded?: boolean;
}

function ProfileImage({
  name,
  matchScore,
  photoURL,
  size = 'large',
  rounded = false,

}: ProfileImageProps) {
  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48', 
    large: 'w-full h-64'
  };

  const roundedClass = rounded ? 'rounded-xl' : '';
  return (
    <div className={`bg-gray-200 flex items-center justify-center relative overflow-hidden ${sizeClasses[size]} ${roundedClass}`}>
      {photoURL ? (
        <img 
          src={photoURL} 
          alt={`${name}'s profile`}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-gray-400 text-lg font-semibold">No Photo</span>
      )}
      
      {/* Optional Match Score Badge */}
      {matchScore !== undefined && (
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          {matchScore}% Match
        </div>
      )}
    </div>
  );
}

export default ProfileImage