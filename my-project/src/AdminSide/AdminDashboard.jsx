import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsTaxiFront, BsCreditCard2Front } from "react-icons/bs";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { BsQuestionSquare } from "react-icons/bs";
import StudentParkingDataGraph from '../components/StudentParkingDataGraph.jsx';
import FacultyParkingDataGraph from '../components/FacultyParkingDataGraph.jsx';
import TotalUsersData from '../components/TotalUsersData.jsx';
import AdminStats from '../Pictures/adminstats.png';
import GSO from '../Pictures/gsoo.png';
import { FaUsers } from "react-icons/fa";

export default function AdminDashboard() {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };


  const handleLogout = async () => {
    try {
      console.log('Attempting to log out...');
      const response = await axios.get('https://skyblue-clam-769210.hostingersite.com/logout.php', {
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
        const response = await axios.get('https://skyblue-clam-769210.hostingersite.com/adminfetchdata.php', {
          withCredentials: true,
        });

        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          setError(response.data.message || 'No data found for the logged-in user.');
          navigate('/');
        }
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        console.error('Error fetching data: ', error);
        navigate('/');
      }
    };

    fetchData();
  }, []);


  return (
    <>
      <div className="relative w-full h-screen bg-blue-700 flex">
      <button
          className="lg:hidden bg-white text-blue-700 p-2 rounded-full h-10 w-10 absolute top-4 left-4 z-10"
          onClick={toggleNav}
        >
          {isNavOpen ? '✕' : '☰'}
        </button>

        <nav className={`bg-white rounded-r-2xl drop-shadow-2xl absolute inset-y-0 left-0 transform xl:w-1/5 lg:relative lg:translate-x-0 lg:top-0 lg:w-1/4 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-around lg:overflow-y-auto max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-around max-md:flex max-md:flex-col max-md:justify-around max-md:items-center md:flex md:flex-col md:justify-around md:items-center ${isNavOpen ? 'block w-full' : 'max-sm:hidden md:hidden max-md:hidden'}`}>
          <div className=" w-full h-40 text-blue-700 flex flex-col items-center justify-center text-xl tracking-wider">
              <img src={GSO} className="w-24 h-24" />
              <h1 className="text-2xl tracking-widest lg:text-sm xl:text-2xl">PARKING SYSTEM</h1>
            </div>
          <div className="flex w-full flex-col justify-evenly h-2/4 relative">
            <Link to="/admindashboard" className="group no-underline h-14 flex items-center pl-8 bg-blue-700 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white border-l-2 border-white pl-5 text-lg text-white tracking-widest flex items-center w-full lg:text-sm xl:text-lg ml-5">
              <BsCreditCard2Front /> <span className="ml-5">Dashboard</span>
              </li>
            </Link>
            <Link to="/adminparkingslot" className="group no-underline h-14 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-lg text-blue-700 tracking-widest flex items-center w-full lg:text-sm xl:text-lg ml-5">
              <BsCreditCard2Front /> <span className="ml-5">Parking Slots</span>
              </li>
            </Link>
            <Link to="/adminreport" className="group no-underline w-full h-12 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-lg text-blue-700 tracking-widest flex items-center w-full lg:text-sm xl:text-lg ml-5">
              <BsFillPersonVcardFill /> <span className="ml-5">Report</span>
              </li>
            </Link>
            <Link to="/adminaccount" className="group no-underline h-12 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-lg text-blue-700 tracking-widest flex items-center w-full lg:text-sm xl:text-lg ml-5">
              <BsQuestionSquare /> <span className="ml-5">Account</span>
              </li>
            </Link>
            <Link to="/adminuserlist" className="group no-underline h-12 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-lg text-blue-700 tracking-widest flex items-center w-full lg:text-sm xl:text-lg ml-5">
              <FaUsers /> <span className="ml-5">User List</span>
              </li>
            </Link>
          </div>
          <button className="w-full bg-blue-900 h-12 text-red-600 font-semibold tracking-widest text-lg bg-white flex items-center justify-center" onClick={() => setLogoutMessage(true)}>
            <span className="hover:text-white hover:bg-red-600 flex items-center justify-center w-full h-full transition ease-linear duration-200"><FiLogOut className="rotate-180 mr-2"/>Logout</span>
          </button>
        </nav>


        <div className="w-full h-full flex flex-col">
          <div className="w-full h-20 flex justify-end items-end border-b-2">
            <p className="text-white font-semibold text-2xl tracking-widest z-10 mr-5">Dashboard</p>
          </div>
          <div className="w-full h-full overflow-auto flex flex-col">
            <h1 className="text-white p-3">Welcome To Your Dashboard</h1>
            <div className="w-full h-1/2 flex justify-around">
              <div className="w-2/5 h-full">
                <img src={AdminStats} alt="Statistics Image"/>
              </div>
              <div className="w-2/5 h-full">
                <StudentParkingDataGraph />
              </div>
            </div>
            <div className="w-full h-1/2 mt-10 flex justify-around">
              <div className="w-2/5 h-full">
                <TotalUsersData />
              </div>
              <div className="w-2/5 h-full">
                <FacultyParkingDataGraph />
              </div>
            </div>
          </div>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {logoutMessage && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-center rounded-lg shadow-lg p-5">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="flex justify-around mt-4">
              <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setLogoutMessage(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  );
}
