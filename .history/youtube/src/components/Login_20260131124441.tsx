import React, { useState } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import axios from 'axios';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string;
    email?: string;
    phone?: string;
}

interface LoginProps {
    onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const { isSouthIndian, userLocation } = useTheme();
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [isLoading, setIsLoading] = useState(false);
    const [otpMethod, setOtpMethod] = useState<'email' | 'sms' | null>(null);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('/api/send-otp', {
                email: isSouthIndian ? email : undefined,
                phoneNumber: isSouthIndian ? undefined : phoneNumber,
                location: userLocation
            });

            if (response.data.success) {
                setOtpMethod(response.data.method);
                setStep('otp');
                toast.success(`OTP sent successfully via ${response.data.method}`);
            }
        } catch (error) {
            const axiosError = error as any;
            toast.error(axiosError.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // In a real implementation, you would verify the OTP with your backend
        // This is a mock verification
        if (otp.length === 6 && /^\d+$/.test(otp)) {
            toast.success('Login successful!');
            // Mock user object
            const user = {
                id: 'user123',
                name: isSouthIndian ? email.split('@')[0] : 'User',
                email: isSouthIndian ? email : undefined,
                phone: isSouthIndian ? undefined : phoneNumber
            };
            onLogin(user);
        } else {
            toast.error('Invalid OTP. Please enter a 6-digit number.');
        }

        setIsLoading(false);
    };

    const handleResendOTP = async () => {
        // Reset and resend
        setOtp('');
        await handleSendOTP({ preventDefault: () => { } } as React.FormEvent);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            {isSouthIndian
                                ? 'South Indian user detected - OTP will be sent via email'
                                : 'OTP will be sent via SMS to your mobile number'
                            }
                        </p>
                    </div>

                    {step === 'form' ? (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            {isSouthIndian ? (
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter your phone number"
                                        required
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="------"
                                    maxLength={6}
                                    required
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                                    OTP sent via {otpMethod}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={isLoading}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Resend OTP
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || otp.length !== 6}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        <p>Location detected: {userLocation || 'Detecting...'}</p>
                        <p>Theme: {isSouthIndian && new Date().getHours() >= 10 && new Date().getHours() < 12 ? 'Light' : 'Dark'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;