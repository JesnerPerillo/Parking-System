/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FcTemplate } from "react-icons/fc";
import { FcAutomotive } from "react-icons/fc";
import { FcCustomerSupport } from "react-icons/fc";
import { FcServices } from "react-icons/fc";
import { FiLogOut } from "react-icons/fi";

export default function FacultyStaffDashboard() {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLogout = async () => {
    try {
      console.log('Attempting to log out...');
      const response = await axios.get('http://localhost/website/my-project/Backend/logout.php', {
        withCredentials: true,
      });

      console.log('Logout response:', response.data);

      if (response.data.success) {
        navigate('/');
      } else {
        setError('Logout failed. Please try again.');
      }
    } catch (error) {
      setError('Error logging out: ' + error.message);
      console.error('Error logging out: ', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost/website/my-project/Backend/facultyfetchdata.php', {
          withCredentials: true
        });

        if (response.data.success) {
          setUserData(response.data.data); // Assuming `data` contains the user information
        } else {
          setError(response.data.message || 'No data found for the logged-in user.');
        }
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="relative w-full h-screen bg-blue-900 flex">
        {/* Navigation button */}
        <button
          className="lg:hidden bg-white text-blue-900 p-2 rounded-full fixed top-4 left-4 z-50"
          onClick={toggleNav}
        >
          {isNavOpen ? '✕' : '☰'}
        </button>

        {/* Navigation menu */}
        <nav className={`bg-white absolute inset-y-0 left-0 transform lg:relative lg:translate-x-0 lg:top-0 lg:w-1/4 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-around lg:overflow-y-auto max-sm:flex max-sm:flex-col max-sm:items-center max-md:flex max-md:flex-col max-md:items-center md:flex md:flex-col md:items-center ${isNavOpen ? 'block w-full' : 'max-sm:hidden md:hidden max-md:hidden'}`}>
          <div className="bg-blue-900 w-3/4 h-24 text-white flex flex-col items-center justify-center mt-10 rounded-xl text-xl tracking-wider">
            <h1 className="text-bold text-white text-3xl tracking-widest">{userData.Name}</h1>
            <p className="text-xs">{userData.Position}</p>
          </div>
          <ul className="flex flex-col justify-evenly p-5 w-full h-2/4 relative">
            <Link to="/facultystaffdashboard" className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200 bg-blue-900" href="#">
              <li className="group-hover:text-white text-2xl text-white tracking-widest flex items-center w-full">
              <FcTemplate /> <span className="ml-5">Dashboard</span>
              </li>
            </Link>
            <Link to="/facultystaffparkingslot" className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full">
              <FcAutomotive /> <span className="ml-5">Parking Slots</span> 
              </li>
            </Link>
            <Link to="/facultystaffreport" className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200" href="#">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full">
              <FcCustomerSupport /> <span className="ml-5">Report</span> 
              </li>
            </Link>
            <Link to="/facultystaffaccount" className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200 " href="#">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full">
              <FcServices /> <span className="ml-5">Account</span> 
              </li>
            </Link>
          </ul>
          <button className="w-3/4 h-14 rounded-xl text-red-600 border border-red-500 font-semibold tracking-widest text-2xl bg-white flex items-center justify-center hover:bg-red-600 " onClick={handleLogout}>
            <span className="hover:text-white hover:bg-red-600 rounded-xl flex items-center justify-center w-full h-full"><FiLogOut />Logout</span>
          </button>
        </nav>

        <div className="w-full">
          <div className="w-full h-20 flex justify-end items-end border-b-2">
            <p className={`text-white font-semibold text-2xl tracking-widest z-10 mr-5 ${isNavOpen ? 'hidden' : 'block'}`}>Dashboard</p>
          </div>
        </div>
      </div>
    </>
  );
}
