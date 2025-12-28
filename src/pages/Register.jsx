import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { Loader2, CheckCircle } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();

    // Steps: 'register' -> 'otp'
    const [step, setStep] = useState('register');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        terms: false,
        otp: ''
    });

    const [status, setStatus] = useState({ loading: false, error: '', success: false });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // --- STEP 1: REGISTER USER ---
    const handleRegister = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: false });

        try {
            // A. Get Location
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // B. Prepare Data
            const finalData = {
                ...formData,
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                }
            };

            // C. Call Register Endpoint (Saves to DB)
            const registerRes = await fetch(`${import.meta.env.VITE_BASEURL}/client/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            const registerData = await registerRes.json();

            if (!registerRes.ok) {
                throw new Error(registerData.message || registerData.error || "Registration failed");
            }

            // D. If Register Success -> Send OTP
            await sendOtpToUser();

            // E. Switch UI to OTP Mode
            setStep('otp');
            setStatus({ loading: false, error: '', success: false }); // Reset status for next step

        } catch (err) {
            console.error(err);
            setStatus({ loading: false, error: err.message || "Failed to register", success: false });
        }
    };

    // --- STEP 2: SEND OTP (Internal Helper) ---
    const sendOtpToUser = async () => {
        const res = await fetch(`${import.meta.env.VITE_BASEURL}/client/sendOtp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.email,
                phone: formData.phone
            }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to send OTP");
    };

    // --- STEP 3: VERIFY OTP ---
    const handleVerify = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: false });

        try {
            const res = await fetch(`${import.meta.env.VITE_BASEURL}/client/varifyOtp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    otp: formData.otp
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || data.error || "Invalid OTP");
            }

            // Success!
            setStatus({ loading: false, error: '', success: true });

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setStatus({ loading: false, error: err.message, success: false });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200">

                {/* Header */}
                <div className="bg-amber-600 p-8 text-center">
                    <h2 className="text-3xl font-bold text-white tracking-wide">
                        {step === 'register' ? 'Join Us' : 'Verify Account'}
                    </h2>
                    <p className="text-amber-100 mt-2">
                        {step === 'register' ? 'Create your new account' : `Code sent to ${formData.email}`}
                    </p>
                </div>

                <div className="p-8">
                    {/* Status Messages */}
                    {status.error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200 animate-fade-in">
                            {status.error}
                        </div>
                    )}
                    {status.success && (
                        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200 animate-fade-in flex items-center gap-2">
                            <CheckCircle size={16} /> Verified! Redirecting...
                        </div>
                    )}

                    {/* --- VIEW 1: REGISTRATION FORM --- */}
                    {step === 'register' && (
                        <form onSubmit={handleRegister} className="animate-fade-in">
                            <FormInput
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                                required
                            />
                            <FormInput
                                label="Email Address"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                required
                            />
                            <FormInput
                                label="Phone Number"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 234 567 8900"
                                required
                            />
                            <FormInput
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />

                            <div className="flex items-center mb-6">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    checked={formData.terms}
                                    onChange={handleChange}
                                    required
                                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-stone-600">
                                    I agree to the{" "}
                                    <Link
                                        to="/terms"
                                        className="text-amber-600 hover:underline font-medium"
                                    >
                                        Terms of Service
                                    </Link>
                                </label>

                            </div>

                            <Button
                                text={status.loading ? 'Creating Account...' : 'Continue'}
                                type="submit"
                                disabled={status.loading}
                            />
                        </form>
                    )}

                    {/* --- VIEW 2: OTP VERIFICATION --- */}
                    {step === 'otp' && (
                        <form onSubmit={handleVerify} className="animate-in slide-in-from-right duration-300">
                            <div className="mb-6 text-center">
                                <div className="text-4xl mb-2">📩</div>
                                <p className="text-stone-500 text-sm">
                                    We have created your account. Please enter the OTP sent to your email to verify it.
                                </p>
                            </div>

                            <FormInput
                                label="Enter One-Time Password"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                placeholder="e.g. 123456"
                                required
                                className="text-center text-2xl tracking-widest"
                            />

                            <Button
                                text={status.loading ? 'Verifying...' : 'Verify & Login'}
                                type="submit"
                                disabled={status.loading}
                            />

                            <div className="mt-4 text-center">
                                <button
                                    type="button"
                                    onClick={() => sendOtpToUser().then(() => alert("OTP Resent!"))}
                                    className="text-sm text-stone-400 hover:text-amber-600 underline"
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Footer Links */}
                    {step === 'register' && (
                        <div className="mt-6 text-center">
                            <p className="text-sm text-stone-500">
                                Already have an account?{' '}
                                <Link to="/login" className="font-semibold text-amber-600 hover:text-amber-700">
                                    Log In
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;