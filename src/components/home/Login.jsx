"use client";
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, loginUser, resetPassword } from "@/store/authSlice";
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const AuthFlow = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const authError = useSelector((state) => state.auth.error);
  const [currentScreen, setCurrentScreen] = useState('login'); // login, forgot, otp, reset
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  // Login Screen
  const renderLoginScreen = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-white">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex items-center justify-center bg-[#F4F4F4] p-12">
        <div className="w-full max-w-md">
          <img 
            src="/login.png" 
            alt="Security Illustration"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/log-logo.png" 
              alt="Hinuu Logo"
              className="h-16 mb-6"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nice to see you!</h1>
            <p className="text-gray-500">Enter your email and password to sign in</p>
          </div>

          {/* Login Form */}
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                />
                <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>
              <button
                onClick={() => setCurrentScreen('forgot')}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Forgot password?
              </button>
            </div>

            {authError ? (
              <p className="text-sm text-red-600">{authError}</p>
            ) : null}

            <Button
              disabled={authStatus === "loading"}
              onClick={async () => {
                const result = await dispatch(
                  loginUser({
                    email: loginEmail,
                    password,
                    rememberMe,
                    fcmToken: null,
                  })
                );
                if (loginUser.fulfilled.match(result)) {
                  router.push('/home');
                }
              }}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white text-base"
            >
              {authStatus === "loading" ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Forgot Password Screen
  const renderForgotPasswordScreen = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-gray-100">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex items-center justify-center bg-gray-50 p-12">
        <div className="w-full max-w-md">
          <img 
            src="/pass.png" 
            alt="Forgot Password Illustration"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/log-logo.png" 
              alt="Hinuu Logo"
              className="h-16 mb-6"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
            <p className="text-gray-500">Please enter your email address to reset your password.</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>

            {authError ? (
              <p className="text-sm text-red-600">{authError}</p>
            ) : null}

            <Button
              disabled={authStatus === "loading"}
              onClick={async () => {
                const result = await dispatch(forgotPassword({ email }));
                if (forgotPassword.fulfilled.match(result)) {
                  setCurrentScreen('otp');
                }
              }}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white text-base"
            >
              {authStatus === "loading" ? "Sending..." : "Send OTP"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // OTP Verification Screen
  const renderOtpScreen = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-gray-100">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex items-center justify-center bg-gray-50 p-12">
        <div className="w-full max-w-md">
          <img 
            src="/pass.png" 
            alt="OTP Verification Illustration"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Right Side - OTP Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/log-logo.png" 
              alt="Hinuu Logo"
              className="h-16 mb-6"
            />
            <button
              onClick={() => setCurrentScreen('forgot')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Email</h1>
            <p className="text-gray-500">Please enter the otp we have sent you in your email.</p>
          </div>

          {/* OTP Input */}
          <div className="space-y-6">
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-14 h-14 text-center text-xl font-semibold bg-blue-400 text-white border-none"
                />
              ))}
            </div>

            <Button 
              onClick={() => setCurrentScreen('reset')}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white text-base"
            >
              Verify Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Reset Password Screen
  const renderResetPasswordScreen = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-gray-100">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex items-center justify-center bg-gray-50 p-12">
        <div className="w-full max-w-md">
          <img 
            src="/pass.png" 
            alt="Reset Password Illustration"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Right Side - Reset Password Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/log-logo.png" 
              alt="Hinuu Logo"
              className="h-16 mb-6"
            />
            <button
              onClick={() => setCurrentScreen('otp')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-500">Your password must be 8-10 character long.</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Set your password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {authError ? (
              <p className="text-sm text-red-600">{authError}</p>
            ) : null}

            <Button
              disabled={authStatus === "loading"}
              onClick={async () => {
                const otpCode = otp.join("");
                const result = await dispatch(
                  resetPassword({
                    email,
                    otp: otpCode,
                    password: newPassword,
                  })
                );
                if (resetPassword.fulfilled.match(result)) {
                  setCurrentScreen('login');
                }
              }}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white text-base"
            >
              {authStatus === "loading" ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {currentScreen === 'login' && renderLoginScreen()}
      {currentScreen === 'forgot' && renderForgotPasswordScreen()}
      {currentScreen === 'otp' && renderOtpScreen()}
      {currentScreen === 'reset' && renderResetPasswordScreen()}
    </>
  );
};

export default AuthFlow;
