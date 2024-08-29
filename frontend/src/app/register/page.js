'use client'
import React, { useCallback, useState } from 'react'
import { debounce } from 'lodash';

export default function Register() {
 const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [pan, setPan] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [dobError, setDobError] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [aadhaarError, setAadhaarError] = useState('');
  const [panError, setPanError] = useState('');
  const [bankAccountError, setBankAccountError] = useState('');
   const [gst, setGst] = useState('');
  const [gstError, setGstError] = useState('');

  const debouncedValidateName = useCallback(
    debounce((value) => {
      const regex = /^[A-Za-z\s]+$/; // Allows letters and spaces only
      if (value.length < 5) {
        setNameError("Name must be at least 5 characters long.");
      } else if (value.length > 20) {
        setNameError("Name cannot exceed 20 characters.");
      } else if (!regex.test(value)) {
        setNameError("Name cannot contain special characters.");
      } else {
        setNameError(""); // No error
      }
    }, 300), // Delay of 300ms
    []
  );

   const debouncedValidateEmail = useCallback(
    debounce((value) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
      if (!regex.test(value)) {
        setEmailError("Please enter a valid email address.");
      } else {
        setEmailError(""); // No error
      }
    }, 300), // Delay of 300ms
    []
  );

   const debouncedValidatePassword = useCallback(
    debounce((value) => {
      const minLength = 8;
      const hasNumber = /\d/;
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
      if (value.length < minLength) {
        setPasswordError("Password must be at least 8 characters long.");
      } else if (!hasNumber.test(value)) {
        setPasswordError("Password must contain at least one number.");
      } else if (!hasSpecialChar.test(value)) {
        setPasswordError("Password must contain at least one special character.");
      } else {
        setPasswordError(""); // No error
      }
    }, 300), // Delay of 300ms
    []
  );

  const debouncedValidateMobile = useCallback(
    debounce((value) => {
      // Enhanced validation regex
      const regex = /^[789]\d{9}$/; // Basic validation for 10-digit numbers starting with 7, 8, or 9
      
      // Additional checks
      if (value.length !== 10) {
        setMobileError("Mobile number must be exactly 10 digits.");
      } else if (!regex.test(value)) {
        setMobileError("Please enter a valid 10-digit mobile number starting with 7, 8, or 9.");
      } else {
        setMobileError(""); // No error
      }
    }, 300),
    []
  );

  const debouncedValidateAadhaar = useCallback(
    debounce((value) => {
      // Remove any spaces from the input
      const cleanedValue = value.replace(/\s/g, '');
      
      // Aadhaar validation regex
      const regex = /^[2-9]{1}[0-9]{11}$/;

      if (cleanedValue.length !== 12) {
        setAadhaarError("Aadhaar number must be 12 digits long.");
      } else if (!regex.test(cleanedValue)) {
        setAadhaarError("Please enter a valid Aadhaar number.");
      } else {
        setAadhaarError(""); // No error
      }
    }, 300),
    []
  );

  const validateBankAccount = (value) => {
    const regex = /^[0-9]{9,18}$/; // Allows only digits and enforces a length between 9 and 18
    if (!regex.test(value)) {
      return "Bank account number must be between 9 and 18 digits.";
    }
    return ""; // No error
  };

  const debouncedValidateBankAccount = useCallback(
    debounce((value) => {
      setBankAccountError(validateBankAccount(value));
    }, 300),
    []
  );

  const handleBankAccountChange = (e) => {
    const value = e.target.value;
    setBankAccount(value);
    debouncedValidateBankAccount(value);
  };


   const validatePan = (value) => {
    const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/; // PAN format
    if (!regex.test(value)) {
      return "PAN must be in the format AAAAA1234A.";
    }
    return ""; // No error
  };

  const debouncedValidatePan = useCallback(
    debounce((value) => {
      setPanError(validatePan(value));
    }, 300),
    []
  );

  const handlePanChange = (e) => {
    const value = e.target.value.toUpperCase(); // Convert to uppercase for consistent validation
    setPan(value);
    debouncedValidatePan(value);
  };


  const validateDate = (value) => {
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = value.match(regex);
    if (!match) {
      return "Date must be in the format DD-MM-YYYY.";
    }
    
    const [_, day, month, year] = match.map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return "Please enter a valid date.";
    }
    return ""; // No error
  };

   const debouncedValidateDob = useCallback(
    debounce((value) => {
      setDobError(validateDate(value));
    }, 300),
    []
  );

   const validateGst = (value) => {
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    const stateCode = parseInt(value.substring(0, 2), 10);

    if (!regex.test(value)) {
      return "Invalid GST number format.";
    } else if (stateCode < 1 || stateCode > 35) {
      return "Invalid state code in GST number.";
    }
    return ""; // No error
  };

  const debouncedValidateGst = useCallback(
    debounce((value) => {
      setGstError(validateGst(value));
    }, 300),
    []
  );

  const handleGstChange = (e) => {
    const value = e.target.value.toUpperCase(); // Ensure the input is in uppercase
    setGst(value);
    debouncedValidateGst(value);
  };


  
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    debouncedValidateName(value); // Call debounced validation
  };

   const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    debouncedValidateEmail(value); // Call debounced validation
  };

   const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    debouncedValidatePassword(value); // Call debounced validation
  };

   const handleMobileChange = (e) => {
    const value = e.target.value;
    setMobile(value);
    debouncedValidateMobile(value); // Call debounced validation
  };

  const handleDobChange = (e) => {
    const value = e.target.value;
    setDob(value);
    debouncedValidateDob(value);
  };

  const handleAadhaarChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
    
    // Add space after every 4 digits
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Limit to 14 characters (12 digits + 2 spaces)
    value = value.slice(0, 14);
    
    setAadhaar(value);
    debouncedValidateAadhaar(value);
  };


  return (
    <>
      <h1 className='text-2xl text-center font-bold mt-2'>Registration Page</h1>
      <form className='flex flex-col gap-2 max-w-[400px] mx-auto my-10'>
        <div className="flex flex-col">
          <input 
            type="text" 
            placeholder='Your Name...' 
            value={name} 
            onChange={handleNameChange} 
            className='h-10 rounded px-3 border-2 border-blue-400 hover:border-blue-600 focus:outline-none focus:border-blue-600 focus-within:border-blue-600'
          />
          {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
        </div>
        <div className="flex flex-col">
          <input 
            type="email" 
            placeholder='Your Email...' 
            value={email} 
            onChange={handleEmailChange} 
            className='h-10 rounded px-3 border-2 border-blue-400 hover:border-blue-600 focus:outline-none focus:border-blue-600 focus-within:border-blue-600'
          />
          {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
        </div>
        <div className="flex flex-col">
          <input 
            type="text" 
            placeholder='Your Password...' 
            value={password} 
            onChange={handlePasswordChange} 
            className='h-10 rounded px-3 border-2 border-blue-400 hover:border-blue-600 focus:outline-none focus:border-blue-600 focus-within:border-blue-600'
          />
          {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
        </div>
        <div className="flex flex-col">
          <input 
            type="tel" 
            placeholder='Your Mobile no...' 
            value={mobile} 
            onChange={handleMobileChange} 
            className='h-10 rounded px-3 border-2 border-blue-400 hover:border-blue-600 focus:outline-none focus:border-blue-600 focus-within:border-blue-600'
          />
          {mobileError && <p className="text-red-500 text-xs mt-1">{mobileError}</p>}
        </div>
        <div className="flex flex-col">
          <input 
            type="text" 
            placeholder='DD-MM-YYYY' 
            value={dob} 
            onChange={handleDobChange} 
            className='h-10 rounded px-3 border-2 border-blue-400 hover:border-blue-600 focus:outline-none focus:border-blue-600 focus-within:border-blue-600'
          />
          {dobError && <p className="text-red-500 text-xs mt-1">{dobError}</p>}
        </div>
        <div className="flex flex-col">
          <input 
            type="text" 
            placeholder='Your Adhaar no...' 
            value={aadhaar} 
            onChange={handleAadhaarChange} 
            className='h-10 rounded px-3 border-2 border-blue-400 hover:border-blue-600 focus:outline-none focus:border-blue-600 focus-within:border-blue-600'
          />
          {aadhaarError && <p className="text-red-500 text-xs mt-1">{aadhaarError}</p>}
        </div>
        <div className="flex flex-col">
          <input 
            type="text" 
            placeholder='Your Pan no...' 
            value={pan} 
            onChange={handlePanChange} 
            className='h-10 rounded px-3 border-2 border-blue-400 hover:border-blue-600 focus:outline-none focus:border-blue-600 focus-within:border-blue-600'
          />
          {panError && <p className="text-red-500 text-xs mt-1">{panError}</p>}
        </div>
        <div className="flex flex-col">
          <input 
            type="text" 
            placeholder='Your Bank Account no...' 
            value={bankAccount} 
            onChange={handleBankAccountChange} 
            className='h-10 rounded px-3 border-2 border-blue-400 hover:border-blue-600 focus:outline-none focus:border-blue-600 focus-within:border-blue-600'
          />
          {bankAccountError && <p className="text-red-500 text-xs mt-1">{bankAccountError}</p>}
        </div>
        <div className="flex flex-col">
          <input 
            type="text" 
            placeholder='Your GST number...' 
            value={gst} 
            onChange={handleGstChange} 
            className='h-10 rounded px-3 border-2 border-blue-400 hover:border-blue-600 focus:outline-none focus:border-blue-600 focus-within:border-blue-600'
          />
          {gstError && <p className="text-red-500 text-xs mt-1">{gstError}</p>}
        </div>
      </form>
    </>
  )
}