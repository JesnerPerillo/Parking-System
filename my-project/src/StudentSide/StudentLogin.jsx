/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import URSlogo from '../Pictures/urs.png';
import GSOlogo from '../Pictures/gsoo.png';
import '../App.css';
import SideImg from '../Pictures/sideimg.png';

export default function StudentLogin() {
    const [studentNumber, setStudentNumber] = useState('');
    const [fullname, setFullname] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const handleOpenModal = () => {
        setIsVisible(true);
    };

    const handleCloseModal = () => {
        setIsVisible(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://seagreen-wallaby-986472.hostingersite.com/studentlogin.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentNumber, fullname, password }),
                credentials: 'include', // Include cookies in the request
            });

            const data = await response.json();

            if (data.success) {
                navigate('/studentdashboard');
            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An unexpected error occurred.');
        }
    };

    const handleSubmitForgetPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setMessage('Please enter your email.');
            return;
        }

        try {
            const response = await fetch('https://seagreen-wallaby-986472.hostingersite.com/forgetpassword.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
                credentials: 'include',
            });

            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                setMessage(data.success ? 'A temporary password has been sent to your email.' : data.message || 'Something went wrong. Please try again.');
            } else {
                setMessage('Unexpected response format.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };
    


    return (
        <div className="bg-gradient-to-r from-blue-700 w-full to-teal-700 min-h-screen flex flex-col items-center">
            <div className="relative form xl:w-2/4 mt-28 justify-between rounded-xl h-4/5 sm:flex max-sm:flex-column max-sm:text-center max-sm:w-full bg-white">
                <div className="header flex flex-col items-center justify-center space-y-24 w-2/4 h-auto py-4 max-sm:w-full">
                <div className="w-96 h-96 bg-blue-900 rounded-full absolute left-0"></div>
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
                            type="password"
                            placeholder=" "
                            required
                        />
                        <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">
                            Password
                        </span>
                    </label>
                    <button
                        type="submit"
                        className="border-none outline-none py-3 rounded-md text-white text-lg transform transition duration-300 ease bg-cyan-500 hover:bg-cyan-400 sm:py-2.5"
                    >
                        Submit
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <p className="text-center text-base text-gray-400 sm:text-sm">
                        Don't have an account?{' '}
                        <Link to="/studentsignup" className="text-cyan-500 hover:underline ml-1">
                            Signup
                        </Link>
                        <Link to="/studentDashboard" ><button className="w-40 h-10 bg-red-200">Click</button></Link>
                    </p>
                    <a onClick={handleOpenModal} className="text-blue-500 no-underline hover:cursor-pointer">
                            Forgot Password?
                        </a>
                </form>
                {isVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 max-sm:w-full">
                <form onSubmit={handleSubmitForgetPassword} className="bg-white p-6 rounded shadow-md">
                    <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
                    <p className="text-sm">Please enter your registered email.</p>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="border p-2 rounded w-full mb-4"
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                        Submit
                    </button>
                    <button onClick={handleCloseModal}className="bg-blue-500 text-white py-2 px-4 rounded">
                        Cancel
                    </button>
                    {message && <p className="mt-4 text-red-500">{message}</p>}
                </form>
                </div>
                )}
            </div>
        </div>
    );
}
