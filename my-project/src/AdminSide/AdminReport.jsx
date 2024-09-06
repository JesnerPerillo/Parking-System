import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsTaxiFront, BsCreditCard2Front } from "react-icons/bs";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { BsQuestionSquare } from "react-icons/bs";
import StudentMotorcyclePDF from '../components/StudentMotorcyclePDF.jsx';
import StudentTricyclePDF from '../components/StudentTricyclePDF.jsx';
import StudentFourwheelsPDF from '../components/StudentFourwheelsPDF.jsx';
import StudentParkingDataPDF from '../components/StudentParkingDataPDF.jsx';
import FacultyFourwheelsPDF from '../components/FacultyFourwheelsPDF.jsx';
import FacultyMotorcyclePDF from '../components/FacultyMotorcyclePDF.jsx';
import FacultyParkingDataPDF from '../components/FacultyParkingDataPDF.jsx';


export default function AdminReport() {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [vehicleCounts, setVehicleCounts] = useState({});

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
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('http://localhost/website/my-project/Backend/fetchstudentsdata.php', {
          withCredentials: true,
        });

        console.log('Student data response:', response.data); // Log the response data

        if (response.data.success) {
          setUserData(response.data.students);

          // Process vehicle counts
          if (response.data.vehicleCounts) {
            const vehicleCounts = {};
            for (const [vehicle, count] of Object.entries(response.data.vehicleCounts)) {
              vehicleCounts[vehicle] = Number(count);
            }
            setVehicleCounts(vehicleCounts);
          } else {
            setVehicleCounts({}); // Default to an empty object if vehicleCounts is missing
          }
        } else {
          setError(response.data.message || 'No data found for the logged-in user.');
        }
      } catch (error) {
        setError('Error fetching student data: ' + error.message);
        console.error('Error fetching student data: ', error);
      }
    };

    fetchStudentData();
  }, []);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get('http://localhost/website/my-project/Backend/adminfetchdata.php', {
          withCredentials: true,
        });

        console.log('Admin data response:', response.data); // Log the response data

        if (response.data.success) {
          // Handle admin data if needed
        } else {
          setError(response.data.message || 'No data found for the admin.');
        }
      } catch (error) {
        setError('Error fetching admin data: ' + error.message);
        console.error('Error fetching admin data: ', error);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <>
      <div className="relative w-full h-screen bg-blue-900 flex">
        <button
          className="lg:hidden bg-white text-blue-900 p-2 rounded-full fixed top-4 left-4 z-50"
          onClick={toggleNav}
        >
          {isNavOpen ? '✕' : '☰'}
        </button>

        <nav
          className={`bg-white drop-shadow-2xl absolute inset-y-0 left-0 transform lg:relative lg:translate-x-0 lg:top-0 lg:w-1/4 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-around lg:overflow-y-auto max-sm:flex max-sm:flex-col max-sm:items-center max-md:flex max-md:flex-col max-md:items-center md:flex md:flex-col md:items-center ${
            isNavOpen ? 'block w-full' : 'max-sm:hidden md:hidden max-md:hidden'
          }`}
        >
          <div className="border-b-2 border-blue-900 w-full h-32 text-blue-900 flex flex-col items-center justify-center text-xl tracking-wider">
              <h1 className="text-bold text-4xl tracking-widest mb-3">ADMIN</h1>
              <h1 className="text-bold text-4xl tracking-widest">PARKING SYSTEM</h1>
            </div>
          <div className="flex w-full flex-col justify-evenly h-2/4 relative">
          <Link to="/admindashboard" className="group no-underline h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsCreditCard2Front /> <span className="ml-5">Dashboard</span>
              </li>
            </Link>
            <Link to="/adminparkingslot" className="group no-underline h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full lg:text-base xl:text-2xl ml-5">
              <BsTaxiFront /> <span className="ml-5">Parking Slot</span>
              </li>
            </Link>
            <Link to="/adminreport" className="group no-underline w-full h-16 flex items-center bg-blue-900 pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white border-l-2 border-white pl-5 text-2xl text-white tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsFillPersonVcardFill /> <span className="ml-5">Report</span>
              </li>
            </Link>
            <Link to="/adminaccount" className="group no-underline h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsQuestionSquare /> <span className="ml-5">Account</span>
              </li>
            </Link>
          </div>
          <button className="w-3/4 h-14 rounded-xl text-red-600 border border-red-500 font-semibold tracking-widest text-2xl bg-white flex items-center justify-center hover:bg-red-600" onClick={handleLogout}>
          <span className="hover:text-white hover:bg-red-600 rounded-xl flex items-center justify-center w-full h-full transition ease-linear duration-200"><FiLogOut className="rotate-180"/>Logout</span>
        </button>
        </nav>

        {/*Main Content */}
        <div className="w-full h-screen flex flex-col">
          <div className="w-full h-20 flex justify-end items-end border-b-2">
            <p className="text-white font-semibold text-2xl tracking-widest z-10 mr-5">Report</p>
          </div>
          <div className="w-4/5 rounded-xl h-2/5 mt-10 ml-32 p-5  bg-gradient-to-r from-gray-800 to-gray-900">
            <div className="text-center mb-2 text-white">
              <h1>Students</h1>
            </div>
            <div>
              <div className="W-4/5 h-1/3 flex justify-around">
                <div className="w-60 h-60 bg-white rounded flex flex-col justify-between items-center border shadow-xl mb-2">
                  <StudentMotorcyclePDF />
                  <p className="text-lg font-bold"> Motorcycle</p>
                </div>
                <div className="w-60 h-60 bg-white rounded flex flex-col justify-between items-center border shadow-xl">
                  <StudentTricyclePDF />
                  <p className="text-lg font-bold"> Tricycle</p>
                </div>
                <div className="w-60 h-60 bg-white rounded flex flex-col justify-between items-center border shadow-xl">
                  <StudentFourwheelsPDF />
                  <p className="text-lg font-bold"> FourWheeler</p>
                </div>
                <div className="w-60 h-60 bg-white rounded flex flex-col justify-between items-center border shadow-xl">
                  <StudentParkingDataPDF />
                  <p className="text-lg font-bold">Student Total User</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-4/5 rounded-xl h-2/5 mt-10 ml-32 p-5  bg-gradient-to-r from-gray-800 to-gray-900">
            <div className="text-center mb-2 text-white">
              <h1>Faculty</h1>
            </div>
            <div>
              <div className="W-4/5 h-1/3 flex justify-around">
                <div className="w-60 h-60 bg-white rounded flex flex-col justify-between items-center border shadow-xl mb-2">
                  <FacultyMotorcyclePDF />
                  <p className="text-lg font-bold">Motorcycle</p>
                </div>
                <div className="w-60 h-60 bg-white rounded flex flex-col justify-between items-center border shadow-xl mb-2">
                  <FacultyFourwheelsPDF />
                  <p className="text-lg font-bold">FourWheeler</p>
                </div>
                <div className="w-60 h-60 bg-white rounded flex flex-col justify-between items-center border shadow-xl mb-2">
                  <FacultyParkingDataPDF />
                  <p className="text-lg font-bold">Faculty Total User</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </>
  );
}
