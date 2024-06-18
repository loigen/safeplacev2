import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/profile', { withCredentials: true });
        setUser(response.data.user); // Assuming response.data.user contains the user object
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Handle error fetching profile
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <div>Loading...</div>; // Optional: Show loading indicator while fetching profile
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user.firstname} {user.lastname}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default Profile;
