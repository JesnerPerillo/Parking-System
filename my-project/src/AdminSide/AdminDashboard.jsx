import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminDashboard() {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
        const response = await axios.get('http://localhost/website/my-project/Backend/adminfetchdata.php', {
          withCredentials: true,
        });

        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          setError(response.data.message || 'No data found for the logged-in user.');
        }
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="w-full h-screen bg-blue-900">
        <button
          className="lg:hidden bg-white text-blue-900 p-2 rounded-full fixed top-4 left-4 z-50"
          onClick={toggleNav}
        >
          {isNavOpen ? '✕' : '☰'}
        </button>

        <nav
          className={`bg-white absolute inset-y-0 left-0 transform lg:relative lg:translate-x-0 lg:top-0 lg:w-1/5 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-around lg:overflow-y-auto max-sm:flex max-sm:flex-col max-sm:items-center max-md:flex max-md:flex-col max-md:items-center md:flex md:flex-col md:items-center ${
            isNavOpen ? 'block w-full' : 'max-sm:hidden md:hidden max-md:hidden'
          }`}
        >
          <div className="bg-blue-900 w-3/4 h-24 text-white flex flex-col items-center justify-center mt-10 rounded-xl text-xl tracking-wider">
            <h1 className="text-bold text-white text-5xl tracking-widest">{userData.Name}</h1>
          </div>
          <ul className="flex flex-col justify-evenly p-5 w-full h-2/4 relative">
            <Link
              to="/admindashboard"
              className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200 bg-blue-900"
            >
              <li className="group-hover:text-white text-2xl text-white tracking-widest">
                <span>Dashboard</span>
              </li>
            </Link>
            <div className="relative ">
              <button
                className="group text-blue-900 no-underline text-left pl-3 h-14 flex items-center rounded-xl hover:bg-blue-900 mb-2 duration-200 w-full max-sm:text-left" 
                onClick={toggleDropdown}
              >
                <span className="group-hover:text-white w-full text-2xl tracking-widest">Parking Slots ↓</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 w-full bg-white shadow-2xl z-10 border rounded-md">
                  <Link
                    to="/adminstudentparkingslot"
                    className="block px-4 py-2 text-blue-900 group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200 hover:text-white"
                  >
                    Students Parking Slot
                  </Link>
                  <Link
                    to="/adminfacultyparkingslot"
                    className="block px-4 py-2 text-blue-900 group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200 hover:text-white"
                  >
                    Faculty | Staff Parking Slot
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/adminreport"
              className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200"
            >
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest">
                Report
              </li>
            </Link>
            <Link
              to="/totalusers"
              className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200"
            >
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest">
                Total Users
              </li>
            </Link>
            <Link
              to="/adminaccount"
              className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200"
            >
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest">
                Account
              </li>
            </Link>
          </ul>
          <button
            className="w-3/4 h-14 rounded-xl text-white font-semibold tracking-widest text-2xl bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </>
  );
}
