import { useState } from 'react';
import ProfileCard from '../components/ProfileCard';
const profiles = [
    { id: 1, name: "Max Shi", major: "Computer Science", graduationYear: 2029 },
    { id: 2, name: "Sarah Chen", major: "Engineering", graduationYear: 2028 },
    { id: 3, name: "Alex Johnson", major: "Business", graduationYear: 2029 },
    { id: 4, name: "Emma Davis", major: "Biology", graduationYear: 2027 },
    { id: 5, name: "Michael Brown", major: "Economics", graduationYear: 2029 },
    { id: 6, name: "Olivia Wilson", major: "Psychology", graduationYear: 2028 },
  ];
const HomePage = () => (
    <section id="home" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Find your next Roommate
            </h1>
            </div>     
        </div> 
        <section id="matches" className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Your Top Matches</h2>
          
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {profiles.map((profile) => (
              <div key={profile.id} className="flex-shrink-0 w-80">
                <ProfileCard
                  name={profile.name}
                  major={profile.major}
                  graduationYear={profile.graduationYear}  
                />
                </div>
            ))}
            </div>
            </div>
        </section>

      </section>
    
);

export default HomePage;
