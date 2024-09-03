'use client'
import { useState, useEffect } from 'react';

const fetchUserPincode = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/user');
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const user = await response.json();
    return user.pin; 
  } catch (error) {
    console.error('Error fetching user pincode:', error);
    return null;
  }
};

const fetchPincodeDetails = async (pincode) => {
  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    if (!response.ok) {
      throw new Error('Failed to fetch pincode details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching pincode details:', error);
    return null;
  }
};

const DisplayUserPincode = () => {
  const [pincode, setPincode] = useState(null);
  const [pincodeDetails, setPincodeDetails] = useState(null);

  useEffect(() => {
    const getPincodeDetails = async () => {
      const userPincode = await fetchUserPincode();
      if (userPincode) {
        setPincode(userPincode);
        const details = await fetchPincodeDetails(userPincode);
        setPincodeDetails(details);
      }
    };

    getPincodeDetails();
  }, []);

  if (!pincodeDetails) {
    return <div className='text-center align-middle text-blue-800 mt-12'>Loading...</div>;
  }

  return (
    <div className='flex items-center justify-center flex-col gap-3 mt-12'>
      <h2>Pincode: {pincode}</h2>
      <p>Area: {pincodeDetails[0]?.PostOffice[0]?.Name || 'N/A'}</p>
      <p>State: {pincodeDetails[0]?.PostOffice[0]?.State || 'N/A'}</p>
      <p>District: {pincodeDetails[0]?.PostOffice[0]?.District || 'N/A'}</p>
      <p>Division: {pincodeDetails[0]?.PostOffice[0]?.Division|| 'N/A'}</p>
    </div>
  );
};

export default DisplayUserPincode;
