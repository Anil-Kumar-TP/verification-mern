'use client'
import React, { useCallback, useState } from 'react'
import { debounce } from 'lodash';
import axios from 'axios';

// Custom validator functions
const Validator = {
  mobile: (value) => /^[6-9]\d{9}$/.test(value),
  pincode: (value) => /^[1-9][0-9]{5}$/.test(value),
  pan: (value) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value),
  aadhaar: (value) => {
    if (!/^[2-9]\d{11}$/.test(value)) return false;  // Basic regex check for Aadhaar number format

    // Verhoeff algorithm tables
    const d = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];

    const p = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    let c = 0;
    const n = value.split('').reverse().map(Number);

    n.forEach((digit, index) => {
      c = d[c][p[(index % 8)][digit]];
    });

    return c === 0;
  },
  gst: (value) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value),
   bankAccount: (value) => /^[0-9]{9,18}$/.test(value),
};

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
  const [pincode, setPincode] = useState('');
  const [pincodeError, setPincodeError] = useState('');

   const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
   const [otpError, setOtpError] = useState(''); 

  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [showValidity, setShowValidity] = useState(false);
  

  const validateName = (value) => {
    if (value === '') return '';
    const regex = /^[A-Za-z\s]+$/;
    if (value.length < 5) {
      return "Name must be at least 5 characters long.";
    } else if (value.length > 20) {
      return "Name cannot exceed 20 characters.";
    } else if (!regex.test(value)) {
      return "Name cannot contain special characters.";
    }
    return '';
  };

  const validateEmail = (value) => {
    if (value === '') return '';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) ? '' : "Please enter a valid email address.";
  };

  const validatePassword = (value) => {
    if (value === '') return '';
    const minLength = 8;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if (value.length < minLength) {
      return "Password must be at least 8 characters long.";
    } else if (!hasNumber.test(value)) {
      return "Password must contain at least one number.";
    } else if (!hasSpecialChar.test(value)) {
      return "Password must contain at least one special character.";
    }
    return '';
  };

  const validateMobile = (value) => {
    if (value === '') return '';
    return Validator.mobile(value) ? 'Valid mobile number' : 'Invalid mobile number';
  };

  const validateAadhaar = (value) => {
    if (value === '') return '';
    return Validator.aadhaar(value) ? 'Valid Aadhaar number' : 'Invalid Aadhaar number';
  };

  const validateBankAccount = (value) => {
  if (value === '') return '';
  const regex = /^[0-9]{9,18}$/;
  return regex.test(value) ? 'Valid bank account number' : "Bank account number must be between 9 and 18 digits.";
};

  const validatePan = (value) => {
    if (value === '') return '';
    return Validator.pan(value) ? 'Valid PAN' : 'Invalid PAN';
  };

  const validateDate = (value) => {
    if (value === '') return '';
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
    return '';
  };

  const validateGst = (value) => {
    if (value === '') return '';
    return Validator.gst(value) ? 'Valid GST number' : 'Invalid GST number';
  };

  const validatePincode = (value) => {
    if (value === '') return '';
    return Validator.pincode(value) ? 'Valid PIN code' : 'Invalid PIN code';
  };

  const debouncedValidate = useCallback(
    debounce((validator, value, setError) => {
      setError(validator(value));
    }, 300),
    []
  );

  const handleChange = (e, validator, setValue, setError) => {
    const { value } = e.target;
    setValue(value);
    debouncedValidate(validator, value, setError);
  };

  const handleNameChange = (e) => handleChange(e, validateName, setName, setNameError);
  const handleEmailChange = (e) => handleChange(e, validateEmail, setEmail, setEmailError);
  const handlePasswordChange = (e) => handleChange(e, validatePassword, setPassword, setPasswordError);
  const handleMobileChange = (e) => handleChange(e, validateMobile, setMobile, setMobileError);
  const handleDobChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2) + '-' + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5);
    handleChange({ target: { value } }, validateDate, setDob, setDobError);
  };
  const handleAadhaarChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 12) value = value.slice(0, 12);
    handleChange({ target: { value } }, validateAadhaar, setAadhaar, setAadhaarError);
  };
  const handlePanChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length > 10) value = value.slice(0, 10);
    handleChange({ target: { value } }, validatePan, setPan, setPanError);
  };
 const handleBankAccountChange = (e) => {
  let value = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters
  if (value.length > 18) value = value.slice(0, 18); // Ensure max length of 18 digits

  const validationError = validateBankAccount(value);
  setBankAccount(value);
  
  setBankAccountError(validationError);

  // Check if the bank account is valid and set showValidity correctly
  if (validationError === 'Valid bank account number') {
    setShowValidity(true);
  } else {
    setShowValidity(false);
  }
};



  
  const handleGstChange = (e) => {
    let value = e.target.value.toUpperCase();
    if (value.length > 15) value = value.slice(0, 15);
    handleChange({ target: { value } }, validateGst, setGst, setGstError);
  };
  const handlePincodeChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 6) value = value.slice(0, 6);
    handleChange({ target: { value } }, validatePincode, setPincode, setPincodeError);
  };


  const handleVerifyMobile = async (e) => {
    e.preventDefault();
  console.log('handleVerifyMobile called'); // Check if this logs when the button is clicked
  
  // Clear previous messages
  setErrorMessage('');
  setSuccessMessage('');
  
  // Validate mobile number
  if (!mobile.trim()) {
    setErrorMessage('Please enter a mobile number.');
    return;
  }
  
  try {
    const response = await fetch('http://localhost:5000/api/send-mobile-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobile }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // If needed, use the response data
    // const data = await response.json();
    // Process the data if required
    // console.log(data);

    setSuccessMessage('OTP sent successfully. Please check your mobile.');
    setShowOtpInput(true); // Show OTP input field
  } catch (error) {
    console.error('Error sending OTP:', error);
    setErrorMessage('Failed to send OTP. Please try again.');
  }
};



  const handleVerifyOtp = async (e) => {
    e.preventDefault();
  console.log('handleVerifyOtp called'); // Check if this logs when the button is clicked

  // Clear previous OTP error message
  setOtpError('');
  setSuccessMessage('');

  // Validate OTP input
  if (!otp.trim()) {
    setOtpError('Please enter the OTP.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/verify-mobile-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobile, otp }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("verified");
    setIsVerified(true); // Set the verification state to true
    setSuccessMessage('OTP verified successfully.');
  } catch (error) {
    console.error('Error verifying OTP:', error);
    setOtpError('Invalid or expired OTP. Please try again.');
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Check if all fields are valid
    if (Object.values({ nameError, emailError, passwordError, mobileError, dobError, bankAccountError, aadhaarError, panError, gstError, pincodeError }).some(error => error)) {
    setErrorMessage('Please correct the errors before submitting.');
    return;
  }

  // Send registration request
  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },  
      body: JSON.stringify({ name, email, password, mobile, dob, adhaar: aadhaar, pan, bank: bankAccount, gst, pin: pincode }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    setSuccessMessage('Registration successful!');
  } catch (error) {
    console.error('Error registering user:', error);
    setErrorMessage('Failed to register. Please try again.');
  }
};


  return (
    <>
      <h1 className='text-2xl text-center font-bold mt-2'>Registration Page</h1>
      <form className='flex flex-col gap-2 max-w-[400px] mx-auto my-10' onSubmit={handleSubmit}>
        <InputField
          type="text"
          placeholder="Your Name..."
          id="name"
          value={name}
          onChange={handleNameChange}
          error={nameError}
        />
        <InputField
          type="email"
          placeholder="Your Email..."
          id="email"
          value={email}
          onChange={handleEmailChange}
          error={emailError}
        />
        <InputField
          type="password"
          placeholder="Your Password..."
          id="password"
          value={password}
          onChange={handlePasswordChange}
          error={passwordError}
        />
        <InputField
          type="text"
          placeholder="Your Mobile no..."
          id="mobile"
          value={mobile}
          onChange={handleMobileChange}
          error={mobileError}
          showValidity
        />
        
        <InputField
          type="text"
          placeholder="DD-MM-YYYY"
          id="dob"
          value={dob}
          onChange={handleDobChange}
          error={dobError}
          maxLength={10}
        />
        <InputField
          type="text"
          placeholder="Your Aadhaar no..."
          id="aadhaar"
          value={aadhaar}
          onChange={handleAadhaarChange}
          error={aadhaarError}
          showValidity
          maxLength={12}
        />
        <InputField
          type="text"
          placeholder="Your PAN no..."
          id="pan"
          value={pan}
          onChange={handlePanChange}
          error={panError}
          showValidity
        />
        <InputField
          type="text"
          placeholder="Your Bank Account no..."
          id="bank"
          value={bankAccount}
          onChange={handleBankAccountChange}
          // error={bankAccountError}
        />
        <p style={{ color: showValidity ? 'green' : 'red' }} className="text-xs mt-1">
        {bankAccountError}
       </p>

        <InputField
          type="text"
          placeholder="Your GST number..."
          id="gst"
          value={gst}
          onChange={handleGstChange}
          error={gstError}
          showValidity
          maxLength={15}
        />
        <InputField
          type="text"
          placeholder="Your Pin number..."
          id="pin"
          value={pincode}
          onChange={handlePincodeChange}
          error={pincodeError}
          showValidity
          maxLength={6}
        />

        <button type='button' onClick={handleVerifyMobile} className='bg-green-400 text-white p-3 rounded-md'>Verify Mobile</button>

        {showOtpInput && (
        <div>
          <InputField value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" error={otpError} />
          <button type='button' onClick={handleVerifyOtp} className='bg-red-400 text-white p-3 rounded-md'>Verify OTP</button>
        </div>
      )}

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        
        {isVerified && <button type="submit" className='bg-blue-500 text-white p-4 rounded-md' onClick={handleSubmit}>Register</button>}
      </form>
    </>
  )
}

const InputField = ({ type, placeholder, id, value, onChange, error, maxLength, showValidity }) => (
  <div className="flex flex-col">
    <input 
      type={type}
      placeholder={placeholder}
      id={id}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className='h-10 rounded px-3 border-2 border-blue-400 hover:border-blue-600 focus:outline-none focus:border-blue-600 focus-within:border-blue-600'
    />
    {error && (
      <p className={`text-xs mt-1 ${showValidity ? (error.startsWith('Valid') ? 'text-green-500' : 'text-red-500') : 'text-red-500'}`}>
        {error}
      </p>
    )}
  </div>
);