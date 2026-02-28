import { useState, useRef } from "react";
import { ChevronRight } from "lucide-react";

// API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface LoginScreenProps {
  onComplete: (userData: any, isSignup: boolean) => void;
}

export function LoginScreen({ onComplete }: LoginScreenProps) {
  // Steps: 'login' (Username/Pass), 'signup_form' (Initial Details), 'signup_otp' (Verify), 'signup_details' (Profile - City/Email)
  const [step, setStep] = useState<"login" | "signup_form" | "signup_otp" | "signup_details">("login");

  // Login State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Sign Up State
  const [signupName, setSignupName] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPhone, setSignupPhone] = useState("");

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showReferral, setShowReferral] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  // Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (data.success) {
          // Store token in localStorage
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
          // Direct login success
          onComplete(data.user, false);
        } else {
          setError(data.message || "Login failed");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSignupFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupName && email && signupUsername && signupPassword && city && signupPhone.length === 10) {
      setLoading(true);
      setError("");
      try {
        const signupData = {
          name: signupName,
          email,
          username: signupUsername,
          password: signupPassword,
          phone: signupPhone,
          city,
          referralCode
        };

        const response = await fetch(`${API_URL}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signupData),
        });
        const data = await response.json();

        if (data.success) {
          if (data.role === 'ADMIN') {
            alert("Admin account requests need approval. Please check your email.");
            setStep("login");
          } else {
            setStep("signup_otp");
          }
        } else {
          setError(data.message || "Signup failed");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_URL}/auth/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });
        const data = await response.json();

        if (data.success) {
          alert("Email Verified! Please login.");
          setStep("login");
        } else {
          setError(data.message || "Invalid OTP");
        }
      } catch (err) {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendOTP = () => {
    alert("OTP Resent!");
  };



  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#3D3066] via-[#5C4E7F] to-[#8B7FA8] p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Form Card */}
      <div className="w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg rounded-2xl bg-gray-50 p-4 xs:p-5 sm:p-6 md:p-8 shadow-xl mx-2 xs:mx-3 sm:mx-4">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        {/* Logo/Image Container */}
        <div className="mb-4 sm:mb-6 md:mb-8 flex items-center justify-center">
          <img
            src="02.png"
            alt="Zold Logo"
            className="h-16 xs:h-20 sm:h-24 md:h-28 lg:h-32 w-auto rounded-2xl object-cover"
          />
        </div>

        {/* LOGIN SCREEN: Username & Password */}
        {step === "login" && (
          <form onSubmit={handleLoginSubmit}>
            <p className="mb-4 sm:mb-6 text-gray-600 text-center font-bold text-base xs:text-lg sm:text-xl">
              Login to continue
            </p>

            <div className="mb-3 xs:mb-4">
              <label className="mb-1 xs:mb-2 block text-xs xs:text-sm sm:text-base text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full rounded-lg border border-gray-300 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base text-gray-800 focus:ring-2 focus:ring-[#8B7FA8] focus:outline-none"
              />
            </div>

            <div className="mb-4 xs:mb-5 sm:mb-6">
              <label className="mb-1 xs:mb-2 block text-xs xs:text-sm sm:text-base text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-lg border border-gray-300 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base text-gray-800 focus:ring-2 focus:ring-[#8B7FA8] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={!username || !password}
              className="flex w-full items-center justify-center gap-1 xs:gap-2 rounded-lg bg-[#3D3066] py-2.5 xs:py-3 sm:py-3.5 text-sm xs:text-base text-white transition-colors hover:bg-[#5C4E7F] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {loading ? "Logging in..." : "Login"}
              <ChevronRight className="h-4 w-4 xs:h-5 xs:w-5" />
            </button>

            <div className="mt-4 xs:mt-5 sm:mt-6 text-center">
              <p className="text-xs xs:text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setStep("signup_form")}
                  className="font-medium text-[#3D3066] hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        )}





        {/* SIGN UP FORM: Name, Username, Pass, Mobile */}
        {step === "signup_form" && (
          <form onSubmit={handleSignupFormSubmit}>
            <h2 className="mb-4 sm:mb-6 text-black text-center text-lg xs:text-xl sm:text-2xl font-semibold">Create Account</h2>

            <div className="mb-3">
              <label className="mb-1 block text-xs xs:text-sm font-medium text-gray-700">Full Name *</label>
              <input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="Enter full name"
                className="w-full rounded-lg border border-gray-300 px-3 xs:px-4 py-2 text-sm xs:text-base text-gray-800 focus:ring-2 focus:ring-[#8B7FA8] focus:outline-none"
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-xs xs:text-sm font-medium text-gray-700">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full rounded-lg border border-gray-300 px-3 xs:px-4 py-2 text-sm xs:text-base text-gray-800 focus:ring-2 focus:ring-[#8B7FA8] focus:outline-none"
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-xs xs:text-sm font-medium text-gray-700">Username *</label>
              <input
                type="text"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                placeholder="Choose a username"
                className="w-full rounded-lg border border-gray-300 px-3 xs:px-4 py-2 text-sm xs:text-base text-gray-800 focus:ring-2 focus:ring-[#8B7FA8] focus:outline-none"
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-xs xs:text-sm font-medium text-gray-700">Password *</label>
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full rounded-lg border border-gray-300 px-3 xs:px-4 py-2 text-sm xs:text-base text-gray-800 focus:ring-2 focus:ring-[#8B7FA8] focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-xs xs:text-sm font-medium text-gray-700">Phone Number *</label>
              <div className="flex gap-2">
                <div className="rounded-lg bg-gray-100 px-3 xs:px-4 py-3 text-black flex items-center text-sm xs:text-base">
                  +91
                </div>
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value.slice(0, 10))}
                  placeholder="10 digit number"
                  className="flex-1 rounded-lg border border-gray-300 px-3 xs:px-4 py-3 text-sm xs:text-base text-black focus:ring-2 focus:ring-[#8B7FA8] focus:outline-none"
                  maxLength={10}
                />
              </div>
            </div>





            <div className="mb-4">
              <label className="mb-1 block text-xs xs:text-sm font-medium text-gray-700">City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
                className="w-full rounded-lg border border-gray-300 px-3 xs:px-4 py-2 text-sm xs:text-base text-gray-800 focus:ring-2 focus:ring-[#8B7FA8] focus:outline-none"
              />
            </div>
            {showReferral && (
              <div className="mb-4">
                <label className="mb-1 block text-xs xs:text-sm font-medium text-gray-700">
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="text-gray-800 w-full rounded-lg border border-gray-300 px-3 xs:px-4 py-2 text-sm xs:text-base focus:ring-2 focus:ring-[#8B7FA8] focus:outline-none"
                />
              </div>
            )}

            {!showReferral && (
              <button
                type="button"
                onClick={() => setShowReferral(true)}
                className="mb-4 sm:mb-6 text-xs xs:text-sm text-[#3D3066] hover:underline"
              >
                Have a referral code?
              </button>
            )}

            <button
              type="submit"
              disabled={!signupName || !email || !signupUsername || !signupPassword || !city || signupPhone.length !== 10}
              className="flex w-full items-center justify-center gap-1 xs:gap-2 rounded-lg bg-[#3D3066] py-2.5 xs:py-3 sm:py-3.5 text-sm xs:text-base text-white transition-colors hover:bg-[#5C4E7F] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {loading ? "Sending OTP..." : "Get OTP"}
              <ChevronRight className="h-4 w-4 xs:h-5 xs:w-5" />
            </button>

            <div className="mt-4 xs:mt-5 text-center">
              <button
                type="button"
                onClick={() => setStep("login")}
                className="text-xs xs:text-sm text-gray-600 hover:underline"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {/* SIGN UP: OTP */}
        {step === "signup_otp" && (
          <form onSubmit={handleOTPSubmit}>
            <h2 className="mb-2 text-black text-lg xs:text-xl sm:text-2xl font-semibold text-center">Verify OTP</h2>
            <p className="mb-4 sm:mb-6 text-gray-600 text-xs xs:text-sm sm:text-base text-center">
              Enter the 6-digit code sent to<br />+91 {signupPhone}
            </p>

            <div className="mb-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                placeholder="Enter OTP"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center tracking-widest text-gray-800 text-base xs:text-lg sm:text-xl focus:ring-2 focus:ring-[#8B7FA8] focus:outline-none"
                maxLength={6}
              />
            </div>

            <div className="mb-4 sm:mb-6 flex flex-col xs:flex-row items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setStep("signup_form")}
                className="text-xs xs:text-sm text-gray-600 hover:underline"
              >
                Change details
              </button>
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-xs xs:text-sm font-medium text-[#3D3066] hover:underline"
              >
                Resend OTP
              </button>
            </div>

            <button
              type="submit"
              disabled={otp.length !== 6}
              className="flex w-full items-center justify-center gap-1 xs:gap-2 rounded-lg bg-[#3D3066] py-2.5 xs:py-3 sm:py-3.5 text-sm xs:text-base text-white transition-colors hover:bg-[#5C4E7F] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {loading ? "Verifying..." : "Verify"}
              <ChevronRight className="h-4 w-4 xs:h-5 xs:w-5" />
            </button>
          </form>
        )}


      </div>
    </div>
  );
}