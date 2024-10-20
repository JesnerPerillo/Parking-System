/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GSOlogo from '../Pictures/gsoo.png';
import SideImg from '../Pictures/sideimg.png';
import { IoEyeOff, IoEye  } from "react-icons/io5";
import { ImSpinner2 } from 'react-icons/im';

export default function StudentLogin() {
    const [studentNumber, setStudentNumber] = useState('');
    const [fullname, setFullname] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [approvalMessage, setApprovalMessage] = useState('');
    const [emailPopup, setEmailPopup] = useState(false);


    const togglePassword = () => {
        setShowPassword(!showPassword);
    }

    const handleOpenModal = () => {
        setIsVisible(true);
    };

    const handleCloseModal = () => {
        setIsVisible(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await fetch('https://skyblue-clam-769210.hostingersite.com/studentlogin.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentNumber, fullname, password }),
                credentials: 'include',
            });
    
            const data = await response.json();
            setErrorMessage(message);
    
            if (data.success) {
                setTimeout(() => {
                    navigate('/studentdashboard');
                }, 300);
            } else {
                if (data.message.includes('not approved')) {
                    setApprovalMessage(true); // Set the approval message
                } else {
                    setError(data.message || 'Login failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    

    const handleSubmitForgetPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setEmailPopup('Please enter your email.');
            return;
        }

        try {
            const response = await fetch('https://skyblue-clam-769210.hostingersite.com/forgetpassword.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
                credentials: 'include',
            });

            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                // Directly set the message returned from the backend
                setEmailPopup(data.message);
            } else {
                setEmailPopup('Unexpected response format.');
            }
        } catch (error) {
            console.error('Error:', error);
            setEmailPopup('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="bg-blue-700 min-h-screen flex flex-col items-center justify-center">
            {/* Modal for Loading Spinner */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg flex items-center justify-center">
                        <ImSpinner2 className="animate-spin w-10 h-10 text-blue-500" />
                    </div>
                </div>
            )}

            <div className="relative form xl:w-2/4 justify-between rounded-xl h-4/5 sm:flex max-sm:flex-column max-sm:text-center max-sm:w-full">
                <div className="header flex flex-col items-center justify-center space-y-24 w-2/4 h-auto py-4 max-sm:w-full">
                    <img src={SideImg} alt="URS Logo" className="w-98 h-98 z-20" />
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 float:right w-2/4 p-6 rounded-2xl relative bg-gray-900 text-white border border-gray-700 max-sm:w-full sm:p-5">
                    <p className="text-3xl font-semibold tracking-tight relative flex items-center pl-7 text-cyan-500 sm:text-2xl">
                        Login (Students)
                        <span className="absolute left-0 h-4 w-4 rounded-full bg-cyan-500 animate-pulse"></span>
                    </p>
                    <p className="text-base text-gray-400 sm:text-sm">Login your Account.</p>
                    <label className="relative">
                        <input
                            name="studentNumber"
                            value={studentNumber}
                            onChange={(e) => setStudentNumber(e.target.value)}
                            className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5"
                            type="text"
                            placeholder=" "
                            required
                        />
                        <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">
                            Student Number
                        </span>
                    </label>
                    <label className="relative">
                        <input
                            name="fullname"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5"
                            type="text"
                            placeholder=" "
                            required
                        />
                        <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">
                            Full Name
                        </span>
                    </label>
                    <label className="relative">
                        <input
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5"
                            type={showPassword ? 'text' : 'password'}
                            placeholder=" "
                            required
                        />
                        <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">
                            Password
                        </span>
                        <button
                            type="button"
                            onClick={togglePassword}
                            className="absolute right-0 top-0 w-16 bg-gray-600 border h-full rounded-r-md flex items-center justify-center">
                            {showPassword ? <IoEyeOff className="w-6 h-6"/> : <IoEye className="w-6 h-6"/>}
                        </button>
                    </label>
                    <button
                        type="submit"
                        className="border-none outline-none py-3 rounded-md text-white text-lg transform transition duration-300 ease bg-cyan-500 hover:bg-cyan-400 sm:py-2.5"
                        disabled={isLoading}
                    >
                        Submit
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-center text-base text-gray-400 sm:text-sm">
                            Don't have an account?{' '}
                            <Link to="/studentsignup" className="text-cyan-500 hover:underline ml-1">
                                Signup
                            </Link>
                        </p>
                        <a onClick={handleOpenModal} className="text-blue-400 text-sm no-underline hover:cursor-pointer">
                            Forgot Password?
                        </a>
                    </div>
                </form>
                {isVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 max-sm:w-full">
                <form onSubmit={handleSubmitForgetPassword} className="bg-white p-6 rounded shadow-md w-full sm:w-1/5">
                    <div className="w-full flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Forgot Password</h2>
                        <img src={GSOlogo} alt="GSO Logo"  className="w-10 h-10"/>
                    </div>
                    <p className="text-sm">Please enter your registered email.</p>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="border p-2 rounded w-full mb-4"
                        required
                    />
                    <div className="w-full flex justify-evenly mb-3">
                        <button type="submit" className="bg-blue-500 w-1/3 text-white py-2 px-4 rounded">
                            Submit
                        </button>
                        <button onClick={handleCloseModal}className="bg-gray-500 w-1/3 text-white py-2 px-4 rounded">
                            Cancel
                        </button>
                    </div>
                </form>
                </div>
                )}

            {approvalMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
                    <div className="bg-white p-6 rounded shadow-md">
                        <h2 className="text-xl font-bold">Notice</h2>
                        <p>Your account is not approved yet. Please wait for the email.</p>
                        <button onClick={() => setApprovalMessage('')} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
                    <div className="bg-white max-w-96 p-6 flex flex-col justify-center rounded shadow-md">
                        <h2 className="text-xl text-center font-bold">Notice <span className="text-red-600">*</span></h2>
                        <p>{message}</p>
                        <button 
                            onClick={() => {
                                setErrorMessage(false);
                            }} 
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                            Okay
                        </button>
                    </div>
                </div>
            )}

            {emailPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
                    <div className="bg-white text-center p-6 rounded shadow-md">
                        <h2 className="text-xl font-bold">Notice</h2>
                        <p>{emailPopup}</p>
                        <button
                            onClick={() => setEmailPopup(false)}
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}  

            </div>
        </div>
    );
}
