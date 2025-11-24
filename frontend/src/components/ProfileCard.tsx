type ProfileCardProps = {
    name: String,
    major: String,
    graduationYear: number,
}

function ProfileCard({name, major, graduationYear}: ProfileCardProps) {
  return (
    <div>
        {/* Profile Image */}
        <div className="bg-gray-200 h-64 flex items-center justify-center">
            <span className="text-gray-400 text-lg font-semibold">No Photo</span>
        </div>
        
        {/* Profile Info */}
        <div className="p-6">
            <h3 className="text-2xl font-bold mb-2">{name}</h3>
            <p className="text-gray-700 mb-1">Major: {major}</p>
            <p className="text-gray-700">Graduation Year: {graduationYear}</p>
        </div>
    </div>
    
  );
}

export default ProfileCard;