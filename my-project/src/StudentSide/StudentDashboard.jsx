/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function StudentDashboard() {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost/website/my-project/Backend/logout.php', {
        withCredentials: true
      });

      if (response.data.success) {
        navigate('/studentlogin');
      } else {
        setError('Logout failed. Please try again.');
      }
    } catch (error) {
      setError('Error Logging out: ' + error.message);
      console.error('Error logging out: ', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost/website/my-project/Backend/fetchdata.php', {
                withCredentials: true // Send cookies with the request
            });

            if (response.data.success) {
                setUserData(response.data.data); // Set user data state
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
      <div className="w-full h-screen bg-blue-900">
        {/* Navigation button */}
        <button
            className="lg:hidden bg-white text-blue-900 p-2 rounded-full fixed top-4 left-4 z-50"
            onClick={toggleNav}
          >
            {isNavOpen ? '✕' : '☰'}
          </button>

          {/* Navigation menu */}
          <nav className={`bg-white absolute inset-y-0 left-0 transform lg:relative lg:translate-x-0 lg:top-0 lg:w-1/5 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-around lg:overflow-y-auto max-sm:flex max-sm:flex-col max-sm:items-center max-md:flex max-md:flex-col max-md:items-center md:flex md:flex-col md:items-center ${isNavOpen ? 'block w-full' : 'max-sm:hidden md:hidden max-md:hidden'}`}>
            <div className="bg-blue-900 w-3/4 h-24 text-white flex flex-col items-center justify-center mt-10 rounded-xl text-xl tracking-wider">
              <h1 className="text-bold text-white text-xl tracking-widest">{userData.Name}</h1>
              <p className="text-xs">{userData['Student Number']}</p>
            </div>
            <ul className="flex flex-col justify-evenly p-5 w-full h-2/4 relative">
              <Link to="/studentdashboard" className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200 bg-blue-900" href="#">
                <li className="group-hover:text-white text-2xl text-white tracking-widest">
                  <span>Dashboard</span>
                </li>
              </Link>
              <Link to="/studentparkingslot" className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200">
                <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest">
                  Parking Slots
                </li>
              </Link>
              <Link to="/studentreport" className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200">
                <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest">
                  Report
                </li>
              </Link>
              <Link to="/studentaccount" className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200" href="#">
                <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest">
                  Account
                </li>
              </Link>
            </ul>
            <button className="w-3/4 h-14 rounded-xl text-white font-semibold tracking-widest text-2xl bg-red-600" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </>
  );
}