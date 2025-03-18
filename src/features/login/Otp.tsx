import React, { useState, useRef, useEffect } from 'react';
import Button from "../../Components/Button";
import bgImage from "../../assets/Images/Group 2506.png";
import { useNavigate, useLocation } from 'react-router-dom';
import toast  from 'react-hot-toast';
import axios from 'axios';
import useApi from '../../Hooks/useApi';
import { endponits } from '../../Services/apiEndpoints';
import { useAuth } from '../../context/AuthContext'; // Import the authentication context

type Props = {}

function Otp({}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { request: verifyOtp } = useApi("post", 5004);
  const { setIsAuthenticated } = useAuth(); // Get the setIsAuthenticated function from context
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  // Extract email from location state or set a default for testing purposes
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  // Handle OTP change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < inputRefs.length - 1) {
        inputRefs[index + 1].current?.focus();
      }
    } else if (value === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  // Handle backspace key for OTP inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '') {
        if (index > 0) {
          inputRefs[index - 1].current?.focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  // Handle OTP paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const pasteOtp = pasteData.split('');
      setOtp(pasteOtp);
      pasteOtp.forEach((digit, index) => {
        if (inputRefs[index].current) {
          inputRefs[index].current!.value = digit;
        }
      });
      inputRefs[5].current?.focus();
    }
    e.preventDefault();
  };

  // Handle OTP submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const enteredOtp = otp.join('');
    try {
      // Send the OTP verification request
      const response = await verifyOtp(endponits.GET_OTP, { email, otp: enteredOtp });
      console.log('OTP Verification Response:', response);

      if (response.response?.data.success) {
        toast.success(response.response?.data.message || 'OTP verified successfully!');
        // Save the token and update the authentication state
        localStorage.setItem('authToken', response.response.data.token);
        setIsAuthenticated(true); // Set authentication state
        navigate('/landing'); // Redirect to the home/dashboard
      } else {
        const errorMessage = response.response?.data.message || 'OTP verification failed.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'OTP verification failed. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        setError('OTP verification failed. Please try again.');
        toast.error('OTP verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100vh]  flex flex-col-reverse md:flex-row">
      {/* Left Side */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-white p-6 md:p-0">
      <div className="w-full max-w-md">
      <p className="text-textColor font-bold text-3xl md:text-4xl">Get Started now</p>
      <p className="text-dropdownText mt-2 text-sm font-normal">Enter your OTP to access your account</p>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* OTP Input Section */}
            <div className="mt-4 space-y-2">
              <label htmlFor="otp" className="text-dropdownText text-sm block">
                Enter OTP
              </label>
              <div className="flex justify-between w-full  overflow-x-scroll sm:overflow-x-hidden">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    name={`otp${index}`}
                    id={`otp${index}`}
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    ref={inputRefs[index]}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    className="text-sm w-[60px] rounded-md text-center mt-1.5 bg-white border border-inputBorder h-[47px] focus:outline-none focus:bg-white focus:border-darkRed"
                  />
                ))}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {/* Submit Button */}
              <div className="flex justify-center">
                <Button type="submit" className="w-full flex justify-center px-6 mt-7">
                  {isLoading ? 'Verifying...' : 'Submit'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

       {/* Right Side */}
       <div className="w-full md:w-1/2 flex justify-center items-center bg-[#CACCBE] p-6 md:p-0">
        <div className="flex flex-col items-start justify-center w-full max-w-lg h-full p-4 md:p-8">
          <div className="text-center md:text-left md:ms-[14%]">
            <h2 className="text-textColor font-semibold text-2xl md:text-3xl leading-tight mt-6">
              Transform Your Financial <br className="hidden md:block" /> Management
            </h2>
            <p className="text-textColor mt-3 text-sm">
              Unlock powerful tools to keep your finances on track
            </p>
          </div>
          <img src={bgImage} alt="Dashboard preview" className="w-full" />
        </div>
      </div>
    </div>
  );
}

export default Otp;
